"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const navigate = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsDropdownOpen(false);
  };

  return (
    <div className="hidden lg:block relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
      >
        <div className="w-8 h-8  rounded-xl bg-black! flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
          <span className="text-white font-medium text-sm">
            P
          </span>
        </div>
        <span className="font-medium text-sm text-gray-900">Purav</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Desktop Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50">
          <div className="py-2">
            {/* Settings for admin users */}
            

            {/* Divider for admin users */}
            
            
            <div
              onClick={handleLogout}
              className="px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer transition-all duration-200 flex items-center space-x-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 