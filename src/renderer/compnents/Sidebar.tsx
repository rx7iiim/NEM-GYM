import React from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  notifCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ notifCount = 0 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
     localStorage.clear();
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-xl overflow-y-hidden">
      {/* Logo/Header */}
      <header className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-emerald-400 tracking-wide">NEM Gym</h1>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </header>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-6 space-y-1">
        <SidebarItem 
          icon={HomeIcon} 
          label="Dashboard" 
          onClick={() => navigate('/dashboard')} 
        />
        <SidebarItem 
          icon={UserGroupIcon} 
          label="Members" 
          onClick={() => navigate('/members')} 
        />
        <SidebarItem 
          icon={CreditCardIcon} 
          label="Payments" 
          onClick={() => navigate('/payments')} 
        />
        <SidebarItem 
          icon={BellAlertIcon} 
          label="Notifications" 
          notifCount={notifCount > 0 ? notifCount : undefined}
          onClick={() => navigate('/notifications')} 
        />
        <SidebarItem 
          icon={Cog6ToothIcon} 
          label="Settings" 
          onClick={() => navigate('/settings')} 
        />
        <SidebarItem 
          icon={UserCircleIcon} 
          label="Profile" 
          onClick={() => navigate('/profile')} 
        />
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-gray-700">
        <SidebarItem 
          icon={ArrowLeftOnRectangleIcon} 
          label="Logout" 
          onClick={handleLogout}
          isLogout
        />
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isLogout?: boolean;
  notifCount?: number;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  isLogout = false, 
  notifCount, 
  onClick 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-4 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors
        ${
          isLogout
            ? 'text-red-400 hover:bg-red-800/30 hover:text-red-300'
            : 'text-gray-300 hover:bg-emerald-700/20 hover:text-white'
        }`}
      onClick={onClick}
      aria-label={label}
    >
      <div className="relative">
        <Icon className="h-5 w-5 flex-shrink-0" />
        {notifCount !== undefined && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[0.65rem] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse">
            {notifCount > 9 ? '9+' : notifCount}
          </span>
        )}
      </div>
      <span className="flex-1 text-left truncate">
        {label}
      </span>
    </motion.button>
  );
};

export default Sidebar;