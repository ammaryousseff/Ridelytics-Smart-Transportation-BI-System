'use client';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { ToastProvider } from '@/context/ToastContext';

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-brand-soft-white cinematic-bg overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-64 w-[600px] h-[600px] bg-brand-teal/5 blur-[100px] rounded-full" />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 relative z-10 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <ToastProvider>
            <div className="max-w-7xl mx-auto animate-fade-in-up">
              {children}
            </div>
          </ToastProvider>
        </main>
      </div>
    </div>
  );
}
