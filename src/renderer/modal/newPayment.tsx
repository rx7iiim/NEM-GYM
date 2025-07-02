import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Member } from '../models/memebers';

interface NewPaymentModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newPayment: {
    memberId: number;
    amount: number;
    expiresAt: string;
  };
  setNewPayment: (payment: any) => void;
  handleAddPayment: () => void;
  email:string
}

const NewPaymentModal: React.FC<NewPaymentModalProps> = ({
  isOpen,
  setIsOpen,
  newPayment,
  setNewPayment,
  handleAddPayment,
  email,
}) => {

const [members, setMembers] = useState<Member[]>([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const initialMembers = await window.electronAPI?.fetchMembers({ email });
      if (Array.isArray(initialMembers)) setMembers(initialMembers);
      else if (initialMembers) setMembers([initialMembers]);
      else setMembers([]);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    }
  };

  if (isOpen && email) {
    fetchData();
    console.log("i got excuted")
    console.log(email)
  }
}, [isOpen,email]);
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gray-900 text-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-gray-700 space-y-4 relative">
          <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-red-500 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
          <Dialog.Title className="text-xl font-semibold mb-2">Add New Payment</Dialog.Title>

          <div>
            <label className="block text-sm mb-1">Member</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2"
              value={newPayment.memberId}
              onChange={(e) => setNewPayment({ ...newPayment, memberId: Number(e.target.value) })}
            >
              <option value="select memeber">Select Member</option>
              
              {members.map((member) => (
                <option key={member.id} value={member.id}>{member.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Amount (DZD)</label>
            <input
              type="number"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Expires At</label>
            <input
              type="date"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2"
              value={newPayment.expiresAt}
              onChange={(e) => setNewPayment({ ...newPayment, expiresAt: e.target.value })}
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddPayment}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 px-5 py-2 rounded text-white font-semibold"
            >
              Add Payment
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default NewPaymentModal;
