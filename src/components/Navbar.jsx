"use client";
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Logo, UserProfile, MobileMenu } from './Navbars';
import Link from 'next/link';

const Navbar = () => {
  const location = usePathname();
  const router = useRouter(); 
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileNotificationsOpen, setIsMobileNotificationsOpen] = useState(false);

  const navBarItems = [
    {
      name: 'Creatives',
      path: '/creatives/new',
    },
  ];
  // Get current active dashboard info


  const handleLogoClick = () => {
    router.push('/');
  };


  // Close mobile menu when clicking outside
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileNotificationsOpen(false);
  };

  return (
    <div className="bg-white! border-b border-white/20 shadow-lg h-16 flex items-center justify-between px-4 md:px-8 relative z-50">
      {/* Left Side - Logo and Navigation */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <Logo onClick={handleLogoClick} />

        {/* Desktop Horizontal Navigation - Only show on large screens */}
        <div className="hidden xl:flex items-center space-x-2">
          {/* Horizontal Dashboard Navigation */}
          <div className="flex items-center space-x-4! overflow-x-auto max-w-2xl scrollbar-hide">
            {/* All Dashboards */}
            {navBarItems.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <Link href={item.path}>
                <span className="text-black!">{item.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Search Bar, Notifications & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Search Bar - Hide on small screens */}
        

        

        {/* Desktop User Profile - Hide on small screens */}
        <div className="hidden lg:block">
          <UserProfile />
        </div>

        {/* Mobile Notifications - Show on tablets and mobile */}
        

        {/* Mobile Hamburger Menu - Show on tablets and mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm bg-white/10"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        navBarItems={navBarItems}
      />

      {/* Click outside to close mobile menu and notifications */}
      {(isMobileMenuOpen || isMobileNotificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
};

export default Navbar; 