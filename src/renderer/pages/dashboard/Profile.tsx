import React, { useState } from 'react';
import { PencilIcon, UserCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../compnents/Sidebar';

const Profile = () => {
  const [username, setUsername] = useState('Rahim Zine');
  const [email, setEmail] = useState('rahim@example.com');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    alert('Profile updated');
    setIsEditing(false);
    if (password) setPassword('');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-[#0f172a] w-full min-h-screen flex overflow-y-hidden">
      <Sidebar />

      <div className="w-4/5 overflow-y-auto scrollbar-hide px-6 pt-8 pb-12">
        <div className="max-w-3xl mx-auto bg-[#1e293b] rounded-xl shadow-md p-8 border border-zinc-700">

          {/* Back Button */}
          <div className="flex items-start justify-between mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">Back</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Info */}
            <div className="flex flex-col items-center">
              <UserCircleIcon className="h-24 w-24 text-emerald-500 opacity-90" />
              <h2 className="text-xl font-semibold text-white mt-3">{username}</h2>
              <p className="text-xs text-zinc-500 mt-1">Member since Jan 2024</p>
            </div>

            {/* Editable Form */}
            <div className="flex-1 space-y-6">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Username</label>
                <input
                  placeholder="..."
                  type="text"
                  className="w-full px-4 py-2 rounded-md bg-[#0f172a] border border-zinc-700 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-zinc-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Email address</label>
                <input
                  placeholder="..."
                  type="email"
                  className="w-full px-4 py-2 rounded-md bg-[#0f172a] border border-zinc-700 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-zinc-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {/* New Password (only shown if editing) */}
              {isEditing && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-md bg-[#0f172a] border border-zinc-700 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-zinc-600"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-zinc-500 mt-1">Leave blank to keep current password</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0f172a] text-emerald-400 border border-emerald-700 rounded-md hover:bg-gray-800 hover:text-emerald-300 transition"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 border border-zinc-700 text-white rounded-md hover:bg-[#1e293b] transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
