"use client";
import { useRouter, usePathname } from 'next/navigation';

const DashboardDropdown = ({ 
  title, 
  dashboards, 
  isOpen, 
  setIsOpen, 
  currentDashboard 
}) => {
  const navigate = useRouter();
  const location = usePathname();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
          location.pathname.startsWith('/iframe/') && currentDashboard.type === title.toLowerCase().split(' ')[0]
                            ? 'bg-gradient-to-r from-[#0072CE] to-[#38B2AC] text-white! shadow-lg'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <span>{title}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {dashboards.length > 0 ? (
              dashboards.map((iframe) => (
                <div
                  key={iframe.id}
                  onClick={() => {
                    navigate(`/iframe/${iframe.id}`);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    location.pathname === `/iframe/${iframe.id}`
                      ? 'bg-gradient-to-r from-[#0072CE]/10 to-[#38B2AC]/10 text-[#0072CE] border-l-4 border-[#0072CE]'
                      : 'text-gray-700'
                  }`}
                >
                  {iframe.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No {title.toLowerCase()} dashboards
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDropdown; 