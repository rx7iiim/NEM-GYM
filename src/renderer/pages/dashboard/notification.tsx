import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Mail, ArrowUp, ArrowDown } from 'lucide-react';
import Sidebar from '../../compnents/Sidebar';
import { useEmail } from '../../context/emailContext';

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type SortField = 'status' | 'message' | 'date';
type SortDirection = 'asc' | 'desc';

const Notifications = () => {
  const { email1, loading } = useEmail();
  const email = String(email1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!email1 || loading) return;
      try {
        const res = await window.electronAPI?.fetchNotifications({ email });
        if (Array.isArray(res)) {
          setNotifications(res);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, [email1, loading]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'status':
        // Sort by read status (unread first)
        comparison = (a.isRead === b.isRead) ? 0 : a.isRead ? 1 : -1;
        break;
      case 'message':
        // Sort by message text
        comparison = a.message.localeCompare(b.message);
        break;
      case 'date':
        // Sort by date
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        break;
    }

    // Reverse if descending
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="h-screen bg-[#0f172a] text-white overflow-y-hidden flex gap-4">
      <Sidebar />
      <div className="overflow-y-auto scrollbar-hide w-4/5 mt-4 px-6 pb-10">
        {/* Stats Header */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1e293b] p-4 rounded-2xl shadow-md">
            <h2 className="text-sm text-zinc-400">Total Notifications</h2>
            <p className="text-xl font-semibold mt-1 text-indigo-400">{notifications.length}</p>
          </div>
          <div className="bg-[#1e293b] p-4 rounded-2xl shadow-md">
            <h2 className="text-sm text-zinc-400">Unread</h2>
            <p className="text-xl font-semibold mt-1 text-red-400">{unreadCount}</p>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="bg-[#1e293b] overflow-auto rounded-2xl border border-zinc-700">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#0f172a] text-zinc-400 text-sm">
              <tr>
                <th className="p-4">
                  <button 
                    onClick={() => handleSort('status')} 
                    className="flex items-center hover:text-white transition"
                  >
                    Status
                    <SortIcon field="status" />
                  </button>
                </th>
                <th className="p-4">
                  <button 
                    onClick={() => handleSort('message')} 
                    className="flex items-center hover:text-white transition"
                  >
                    Message
                    <SortIcon field="message" />
                  </button>
                </th>
                <th className="p-4">
                  <button 
                    onClick={() => handleSort('date')} 
                    className="flex items-center hover:text-white transition"
                  >
                    Received At
                    <SortIcon field="date" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedNotifications.map((notif) => (
                <tr key={notif.id} className="border-t border-zinc-800 hover:bg-gray-700/30 transition">
                  <td className="p-4">
                    {notif.isRead ? (
                      <span className="inline-flex items-center gap-1 text-green-500">
                        <CheckCircle className="w-4 h-4" /> Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-400">
                        <Mail className="w-4 h-4" /> Unread
                      </span>
                    )}
                  </td>
                  <td className="p-4">{notif.message}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <Clock className="w-4 h-4" />
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-zinc-500">
                    No notifications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notifications;