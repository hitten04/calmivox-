
import React, { useState } from 'react';
import { SunIcon, MoonIcon, ImageIcon, CreditCardIcon, AdminDashboardIcon, HistoryIcon, LogoutIcon, MenuIcon, XIcon, LogoIcon, GalleryIcon } from './icons';
import type { Page, User } from '../App';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  currentPage: string;
  setCurrentPage: (page: Page) => void;
  currentUser: User;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, currentPage, setCurrentPage, currentUser, logout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavButton: React.FC<{ page: Page; label: string; icon: React.ReactNode; isMobile?: boolean }> = ({ page, label, icon, isMobile = false }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        if (isMobile) setIsMobileMenuOpen(false);
      }}
      className={
        isMobile
          ? 'flex items-center space-x-3 p-3 rounded-lg w-full text-left text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
          : `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
              currentPage === page
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`
      }
    >
      {icon}
      <span className={isMobile ? '' : 'hidden sm:inline'}>{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <LogoIcon className="w-8 h-8" />
            <h1 className="text-xl font-bold font-display text-gray-900 dark:text-white">Calmivox AI</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-1 md:space-x-2">
             <NavButton page="generator" label="Generator" icon={<ImageIcon className="w-5 h-5" />} />
             <NavButton page="history" label="History" icon={<GalleryIcon className="w-5 h-5" />} />
             <NavButton page="payment" label="Buy Credits" icon={<CreditCardIcon className="w-5 h-5" />} />
             <NavButton page="user-payments" label="My Payments" icon={<HistoryIcon className="w-5 h-5" />} />
             {currentUser.role === 'admin' && (
                <NavButton page="admin" label="Admin" icon={<AdminDashboardIcon className="w-5 h-5" />} />
             )}
          </div>

          {/* Desktop User Info & Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
                <div className="font-semibold text-sm text-gray-800 dark:text-white">{currentUser.name}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-bold">{currentUser.credits.toLocaleString()} Credits</div>
            </div>
             <button
              onClick={logout}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
             <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 animate-fade-in">
           <div className="px-4 pt-2 pb-4 space-y-2">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                  <div className="font-semibold text-base text-gray-800 dark:text-white">{currentUser.name}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-bold">{currentUser.credits.toLocaleString()} Credits</div>
                </div>
                <NavButton page="generator" label="Generator" icon={<ImageIcon className="w-5 h-5" />} isMobile={true} />
                <NavButton page="history" label="History" icon={<GalleryIcon className="w-5 h-5" />} isMobile={true} />
                <NavButton page="payment" label="Buy Credits" icon={<CreditCardIcon className="w-5 h-5" />} isMobile={true} />
                <NavButton page="user-payments" label="My Payments" icon={<HistoryIcon className="w-5 h-5" />} isMobile={true} />
                {currentUser.role === 'admin' && (
                    <NavButton page="admin" label="Admin" icon={<AdminDashboardIcon className="w-5 h-5" />} isMobile={true} />
                )}
                 <button
                    onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 p-3 rounded-lg w-full text-left text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>
           </div>
        </div>
      )}
    </header>
  );
};

export default Header;