'use client';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Terminal Overview';
    if (pathname === '/admin/chat') return 'Cognitive Core (AI)';
    const parts = pathname.split('/');
    if (parts.length > 2) {
      return parts[2].charAt(0).toUpperCase() + parts[2].slice(1).replace('_', ' ');
    }
    return 'Admin';
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-brand-teal/10 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-brand-deep tracking-tight">{getPageTitle()}</h1>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-brand-light rounded-full border border-brand-teal/10">
          <span className="w-2 h-2 rounded-full bg-semantic-positive animate-pulse" />
          <span className="text-xs font-semibold text-brand-teal">System Online</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-brand-slate hover:text-brand-teal transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-semantic-negative rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-brand-light">
          <div className="w-9 h-9 rounded-full bg-brand-deep flex items-center justify-center text-white font-bold shadow-md">
            SA
          </div>
          <div className="hidden md:block text-right">
            <div className="text-sm font-bold text-brand-deep">System Administrator</div>
            <div className="text-xs text-brand-slate font-medium">admin@ridelytics.com</div>
          </div>
          <svg className="w-4 h-4 text-brand-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </header>
  );
}
