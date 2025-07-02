import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../../compnents/Sidebar';
import { useEmail } from '../../context/emailContext';
import { Payment } from '../../models/payments';
import NewPaymentModal from '../../modal/newPayment';
import { date } from 'drizzle-orm/mysql-core';

const Payments = () => {

  const { email1, loading } = useEmail();
  const email = String(email1);
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    email:email,
    memberId: 0,
    amount: 0,
    expiresAt: '',
  });

 

   useEffect(() => {
     const fetchPayments = async () => {
      if (!email1 || loading) return;
       try {
         const data = await window.electronAPI?.fetchPayments({ email });
         if (Array.isArray(data)) setPayments(data);

       } catch (err) {
         console.error('Failed to fetch payments:', err);
       }
     };

     fetchPayments();
   }, [email1, loading]);

  const handleAddPayment = async () => {
    console.log(newPayment)
    newPayment.email=email
    try {
      const res = await window.electronAPI?.addPayment(newPayment);
       const updated = await window.electronAPI.fetchPayments({ email });
    setPayments(updated);
      console.log(res);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to add payment:', err);
    }
  };

  const filtered = payments.filter((p) =>
    p.memberName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const unpaidCount = payments.filter((p) => p.status === 'unpaid').length;

  return (
    <div className="h-screen bg-[#0f172a] text-white overflow-y-hidden flex gap-4">
      <Sidebar />
      <div className="overflow-y-auto scrollbar-hide w-4/5 mt-4 px-6 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1e293b] p-4 rounded-2xl shadow-md">
            <h2 className="text-sm text-zinc-400">Total Revenue</h2>
            <p className="text-xl font-semibold mt-1 text-green-400">{totalRevenue} DZD</p>
          </div>
          <div className="bg-[#1e293b] p-4 rounded-2xl shadow-md">
            <h2 className="text-sm text-zinc-400">Pending Payments</h2>
            <p className="text-xl font-semibold mt-1 text-red-400">{unpaidCount} Athlete(s)</p>
          </div>
          <div className="bg-[#1e293b] p-4 rounded-2xl shadow-md flex items-center justify-between">
            <h2 className="text-sm text-zinc-400">Add Payment</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl shadow"
              onClick={() => setIsOpen(true)}
            >
              <PlusCircle className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        <div className="relative mb-4 max-w-md">
          <Search className="absolute top-3 left-3 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search athlete..."
            className="bg-[#1e293b] rounded-xl pl-10 pr-4 py-2 w-full text-white outline-none border border-zinc-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-[#1e293b] overflow-auto rounded-2xl border border-zinc-700">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#0f172a] text-zinc-400 text-sm">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Paid At</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-zinc-800 hover:bg-gray-700/30 transition">
                  <td className="p-4">{p.memberName}</td>
                  <td className="p-4">{p.planName}</td>
                  <td className="p-4 text-green-400">{p.amount} DZD</td>
                  <td className="p-4">{new Date(p.paidAt).toLocaleDateString()}</td>
                  <td className="p-4">{new Date(p.expiresAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    {p.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-green-500">
                        <CheckCircle className="w-4 h-4" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400">
                        <XCircle className="w-4 h-4" /> Unpaid
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-zinc-500">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewPaymentModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        newPayment={newPayment}
        setNewPayment={setNewPayment}
        handleAddPayment={handleAddPayment}
        email= {email}
      />
    </div>
  );
};

export default Payments;
