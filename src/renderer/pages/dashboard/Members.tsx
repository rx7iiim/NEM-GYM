import React, { useState, ChangeEvent, useEffect } from 'react';
import { Plus, Search,Trash2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Sidebar from '../../compnents/Sidebar';
import { Member } from '../../models/memebers';
import { useEmail } from '../../context/emailContext';

const Members = () => {
  const { email1,loading } = useEmail();
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  const [newMember, setNewMember] = useState<Partial<Member> & { image?: string }>({
    fullName: '',
    email: '',
    serialNumber: '',
    phone: '',
    plan: '',
    subscriptionStart: undefined,
    subscriptionEnd: undefined,
    image: '',
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewMember((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  const email = String(email1);
  const handleDeleteMember = async (id: number) => {
  try {
    const res = await window.electronAPI?.deleteMember(id);
    if (res?.success) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } else {
      console.error("Failed to delete member from DB:", res?.error);
    }
  } catch (err) {
    console.error("Error deleting member:", err);
  }
};

 const handleAddMember = async () => {
  setErrorMsg(null); // Clear previous error

  if (!newMember.fullName || !newMember.serialNumber || !newMember.plan) {
    setErrorMsg('Full name, Serial number, and Plan are required.');
    return;
  }

  const newId = members.length + 1;
  const memberToAdd: Member = {
    id: newId,
    ownerEmail: email,
    fullName: newMember.fullName ?? '',
    serialNumber: newMember.serialNumber ?? '',
    phone: newMember.phone,
    email: newMember.email,
    pfpUrl: newMember.image || "/profile-round-1345-svgrepo-com.svg",
    plan: newMember.plan ?? '',
    subscriptionStart: newMember.subscriptionStart ?? new Date(),
    subscriptionEnd: newMember.subscriptionEnd ?? new Date(),
  };

  try {
    const sub = await window.electronAPI?.addMember(memberToAdd);
    if (sub?.success) {
      setMembers([...members, memberToAdd]);
      setNewMember({
        fullName: '',
        email: '',
        serialNumber: '',
        phone: '',
        plan: '',
        subscriptionStart: undefined,
        subscriptionEnd: undefined,
        image: '',
      });
      setIsOpen(false);
    } else {
      setErrorMsg('Failed to add member. Try again.');
    }
  } catch (error) {
    console.error("Add Member Error:", error);
    setErrorMsg('An unexpected error occurred while adding the member.');
  }
};


  const filtered = members?.filter((m) =>
    m.fullName.toLowerCase().includes(query.toLowerCase())
  ) || [];
  

  useEffect(() => {
     
    const fetchData = async () => {
      try {
        console.log(email)
        const initialMembers = await window.electronAPI?.fetchMembers({ email });
        if (Array.isArray(initialMembers)) setMembers(initialMembers);
        else if (initialMembers) setMembers([initialMembers]);
        else setMembers([]);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      }
    };
if (!loading && email1) {
    fetchData();}
  }, [loading]);
console.log(members)
  return (
  <div className="h-screen bg-[#0f172a] text-white flex gap-4 overflow-y-hidden">
      <Sidebar />
      <div className="h-screen overflow-y-auto scrollbar-hide mt-4 px-6 w-full pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gym Members</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center bg-gradient-to-r from-emerald-500 to-emerald-700 hover:brightness-110 text-white px-5 py-2 rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Member
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {filtered.map((member) => ( 
           <div
  key={member.id}
  className="relative bg-gray-700 backdrop-blur rounded-2xl px-3 py-8 overflow-hidden shadow-md hover:shadow-emerald-700 transition duration-300 flex flex-col items-center text-center"
>
  <button
  className="absolute top-2 right-2 p-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
  onClick={() => handleDeleteMember(member.id)}
  title="Delete member"
>
  <Trash2 className="w-4 h-4" />
</button>


              <div className="flex items-center space-x-4 mb-4">
                <img
                   src={member.pfpUrl}
                  alt={member.fullName}
                  className="w-16 h-16 rounded-full object-cover border border-emerald-700"
                />
                <div>
                  <h2 className="text-lg font-semibold">{member.fullName}</h2>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>
              </div>
              <div className="text-sm space-y-1 text-gray-300">
                <p><span className="text-white font-medium">Serial ID:</span> {member.serialNumber}</p>
                <p><span className="text-white font-medium">Plan:</span> {member.plan}</p>
                <p><span className="text-white font-medium">Start:</span> {member.subscriptionStart?.toString().slice(0, 10)}</p>
                <p><span className="text-white font-medium">End:</span> {member.subscriptionEnd?.toString().slice(0, 10)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 my-3 overflow-auto">
          <div className="fixed inset-0 bg-black/40 " />
          <div className="fixed inset-0 flex items-center justify-center p-4">
           <Dialog.Panel className="bg-gray-900 rounded-2xl w-full max-w-lg text-white shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto p-6 space-y-5">
              <Dialog.Title className="text-xl font-bold mb-2">Add New Member</Dialog.Title>
              {errorMsg && (
  <div className="bg-red-600 text-white p-2 rounded-lg text-sm">
    {errorMsg}
  </div>
)}

              {[
                { label: 'Full Name', key: 'fullName' },
                { label: 'Email', key: 'email' },
                { label: 'Serial Number', key: 'serialNumber' },
                { label: 'Phone', key: 'phone' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm mb-1">{label}</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                    value={(newMember as any)[key] || ''}
                    onChange={(e) => setNewMember({ ...newMember, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="mb-3">
  <label className="block text-sm mb-1">Plan</label>
  <select
    value={newMember.plan}
    onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })}
    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
  >
    <option value="" disabled>Select a plan</option>
    <option value="Basic">Basic</option>
    <option value="Standard">Standard</option>
    <option value="Premium">Premium</option>
  </select>
</div>

              <div>
                <label className="block text-sm mb-1">Subscription Start</label>
                <input
                  type="date"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                  onChange={(e) => setNewMember({ ...newMember, subscriptionStart: new Date(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Subscription End</label>
                <input
                  type="date"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                  onChange={(e) => setNewMember({ ...newMember, subscriptionEnd: new Date(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg file:text-white file:bg-emerald-700 file:border-none"
                />
                {newMember.image && (
                  <img
                    src="/profile-round-1345-svgrepo-com.svg"
                    alt="Preview"
                    className="w-18 h-18 rounded-full mt-2 border border-gray-700 object-cover"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 px-5 py-2 rounded text-white font-semibold"
                >
                  Add Member
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Members;
