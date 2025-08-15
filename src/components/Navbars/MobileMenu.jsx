"use client";
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const MobileMenu = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  navBarItems, 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useRouter();
  const location = usePathname();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Filter dashboards based on search query
  const filteredDashboards = navBarItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchNavigation = (path) => {
    navigate(path);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };



  if (!isMobileMenuOpen) return null;

  return (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-white bg-white border-b border-white/30 shadow-2xl z-50">
      <div className="px-6 py-4 space-y-4">
        {/* Mobile Search */}
    
  

        {/* Mobile Navigation */}
          
          {/* Mobile All Dashboards */}
          <div className="space-y-1">
            
            {navBarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(`/${item.path}`)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === `/${item.path}`
                    ? 'bg-gradient-to-r from-[#0072CE] to-[#38B2AC] text-white! shadow-lg'
                    : 'text-gray-700 hover:bg-white/40'
                }`}
              >
                {item.name}
              </button>
            ))}
            
          </div>

        {/* Mobile User Section */}
        <div className="border-t border-white/30">
          <div className="flex items-center space-x-3 px-4 py-2">
              <div className="w-8 h-8  rounded-xl bg-black! flex items-center justify-center shadow-lg">
              <span className="text-white! font-medium text-sm">
                P
              </span>
            </div>
            <span className="font-medium text-sm text-gray-900">Purav</span>
          </div>
          
          <div className="space-y-1 mt-2">
            
        
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50/50 transition-all duration-200 flex items-center space-x-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 