'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { ENTITY_LIST } from '@/lib/constants';

export default function Topbar({ collapsed }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Build breadcrumb from pathname
  const getBreadcrumb = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 1) return 'Dashboard';
    const entity = ENTITY_LIST.find((e) => e.key === parts[1]);
    if (entity) return entity.label;
    if (parts[1] === 'chat') return 'AI Assistant';
    return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-topbar">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-3">
          <nav className="text-sm">
            <span className="text-brand-slate">Admin</span>
            <span className="text-gray-300 mx-2">/</span>
            <span className="font-semibold text-brand-dark-navy">{getBreadcrumb()}</span>
          </nav>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-brand-slate hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-semantic-negative" />
          </button>

          {/* User Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-teal to-brand-cyan flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-brand-dark-navy">{user?.name || 'Admin'}</div>
                <div className="text-xs text-brand-slate">{user?.role || 'admin'}</div>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-glass-lg border border-gray-100 py-2 animate-fade-in-down">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-semibold text-brand-dark-navy">{user?.name}</div>
                  <div className="text-xs text-brand-slate">{user?.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2.5 text-sm text-semantic-negative hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
