import { DollarSign, Users, Calendar, BarChart3, Wallet, TrendingUp } from 'lucide-react';
import Sidebar from '../../compnents/Sidebar';
import { useEffect, useState } from 'react';
import { useEmail } from '../../context/emailContext';
import { Payment } from '../../models/payments';

interface DashboardData {
  totalincome: number;
  monthlyIncome: number;
  ActiveMembers: number;
  allMembers: number;
  recentPayments: Payment[];
}

interface StatCard {
  icon: JSX.Element;
  label: string;
  value: string;
  change: string;
}

const OwnerDashboard = () => {
  const { email1, loading } = useEmail();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [notifCount, setNotifCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const email = String(email1);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (loading || !email1) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const [dashboardRes, notifRes] = await Promise.all([
          window.electronAPI?.fetchDashboard({ email }),
          window.electronAPI?.checkForExpiredPayments({ email })
        ]);
       console.log('Dashboard Data:', notifRes);
        setDashboardData(dashboardRes);
        setNotifCount (Math.max(0, notifRes.count || 0));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [loading, email1]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0f172a] text-white flex gap-4 overflow-y-hidden">
        <Sidebar notifCount={notifCount} />
        <div className="flex items-center justify-center w-full">
          <div className="text-gray-400 animate-pulse">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#0f172a] text-white flex gap-4 overflow-y-hidden">
        <Sidebar notifCount={notifCount} />
        <div className="flex items-center justify-center w-full">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="h-screen bg-[#0f172a] text-white flex gap-4 overflow-y-hidden">
        <Sidebar notifCount={notifCount} />
        <div className="flex items-center justify-center w-full">
          <div className="text-gray-400">No data available</div>
        </div>
      </div>
    );
  }

  const stats: StatCard[] = [
    { 
      icon: <DollarSign className="w-5 h-5" />, 
      label: 'Total Income', 
      value: `$${dashboardData.totalincome.toLocaleString()}`, 
      change: '+15%' 
    },
    { 
      icon: <Wallet className="w-5 h-5" />, 
      label: 'Monthly Revenue', 
      value: `$${dashboardData.monthlyIncome.toLocaleString()}`, 
      change: '+8%' 
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Active Members', 
      value: dashboardData.ActiveMembers.toString(), 
      change: '-4' 
    },
    { 
      icon: <Calendar className="w-5 h-5" />, 
      label: 'All Members', 
      value: dashboardData.allMembers.toString(), 
      change: '' 
    }
  ];

  return (
    <div className="h-screen bg-[#0f172a] text-white flex gap-4 overflow-y-hidden">
      <Sidebar notifCount={notifCount} />

      <div className="overflow-y-auto scrollbar-hide w-4/5 h-screen mt-4 px-4 pb-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-[#1e293b] p-6 rounded-xl shadow-lg hover:shadow-xl transition hover:bg-[#1e293b]/90"
            >
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                {stat.icon}
                <span className="font-medium">{stat.label}</span>
              </div>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              {stat.change && (
                <p className={`text-sm mt-2 ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change} since last month
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-indigo-300">
            <BarChart3 className="w-5 h-5" /> Monthly Income Overview
          </h2>
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 h-64 rounded-lg flex items-center justify-center text-gray-400">
            [📈 Income Chart]
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-amber-300">
            <TrendingUp className="w-5 h-5" /> Recent Payments
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="text-xs uppercase text-gray-400 border-b border-gray-600">
                <tr>
                  <th scope="col" className="py-3 px-6">Member</th>
                  <th scope="col" className="py-3 px-6">Plan</th>
                  <th scope="col" className="py-3 px-6">Amount</th>
                  <th scope="col" className="py-3 px-6">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentPayments.map((payment: Payment) => (
                  <tr 
                    key={payment.id} 
                    className="border-b border-gray-700 hover:bg-gray-700/30 transition"
                  >
                    <td className="py-4 px-6">{payment.memberName}</td>
                    <td className="py-4 px-6">{payment.planName}</td>
                    <td className="py-4 px-6">${payment.amount}</td>
                    <td className="py-4 px-6">
                      {new Date(payment.paidAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;