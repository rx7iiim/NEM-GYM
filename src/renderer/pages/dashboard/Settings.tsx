import { useState } from 'react';
import { User, Lock, Sun, Trash } from 'lucide-react';
import Sidebar from '../../compnents/Sidebar';

const SettingsPage = () => {
  const [email, setEmail] = useState('admin@gymmaster.com');
  const [name, setName] = useState('Gym Owner');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <div className="h-screen bg-[#0f172a] text-white flex gap-4">
      <Sidebar />
      <div className="w-4/5 overflow-y-auto scrollbar-hide px-6 pt-6 pb-12 space-y-8">
        

        {/* Profile Settings */}
        <section className="bg-[#1e293b] rounded-xl p-6 shadow-md space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2 text-emerald-400">
            <User className="w-5 h-5" /> Profile Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Name</label>
              <input
              placeholder='...'
                type="text"
                className="w-full mt-1 px-4 py-2 bg-[#0f172a] border border-zinc-700 rounded-md focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input
              placeholder='........'
                type="email"
                className="w-full mt-1 px-4 py-2 bg-[#0f172a] border border-zinc-700 rounded-md focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Theme Toggle */}
        <section className="bg-[#1e293b] rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-medium flex items-center gap-2 text-emerald-400">
            <Sun className="w-5 h-5" /> Appearance
          </h2>
          <p className="text-sm text-zinc-400 mt-2">Dark mode is enabled by default.</p>
        </section>

        {/* Password Change */}
        <section className="bg-[#1e293b] rounded-xl p-6 shadow-md space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2 text-emerald-400">
            <Lock className="w-5 h-5" /> Change Password
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Current Password</label>
              <input
              placeholder='........'
                type="password"
                className="w-full mt-1 px-4 py-2 bg-[#0f172a] border border-zinc-700 rounded-md focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">New Password</label>
              <input
              placeholder='........'
                type="password"
                className="w-full mt-1 px-4 py-2 bg-[#0f172a] border border-zinc-700 rounded-md focus:outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-[#1e293b] rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-medium flex items-center gap-2 text-red-400">
            <Trash className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-sm text-zinc-400 mt-2">This will permanently delete your account and all data.</p>
          <button className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded-md font-medium">
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
