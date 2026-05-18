'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function Hero() {
  const [kpis, setKpis] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function fetchKPIs() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/dashboard/kpis`);
        const data = await res.json();
        if (data.success) setKpis(data.data);
      } catch {
        setKpis({ totalTrips: 128540, totalRevenue: 2450000, avgRating: 4.72 });
      }
    }
    fetchKPIs();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-brand-soft-white cinematic-bg">
      {/* Immersive Light Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-cyan/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        
        {/* Subtle grid overlay for tech feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(13,59,78,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(13,59,78,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating Header */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-brand-teal/10 shadow-sm' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in-down">
            <Image src="/images/logo.png" alt="Ridelytics" width={180} height={48} className="h-10 sm:h-12 w-auto" />
          </div>
          <div className="flex items-center gap-6 animate-fade-in-down">
            <div className="hidden md:flex items-center gap-2 text-brand-slate text-sm bg-brand-light/50 px-4 py-2 rounded-full border border-brand-teal/10 backdrop-blur-md">
              <Image src="/images/icon-calendar.png" alt="" width={16} height={16} className="opacity-70" />
              <span>System Status: <span className="text-brand-teal font-semibold">Optimal</span></span>
            </div>
            <button onClick={() => window.location.href = '/login'} className="relative group block cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-teal to-brand-cyan rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative px-6 py-2.5 bg-white border border-brand-cyan/20 text-brand-dark-navy text-sm font-semibold rounded-xl hover:bg-brand-light transition-all backdrop-blur-sm shadow-sm text-center">
                Access Hub
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Cinematic Content */}
      <div className="relative pt-32 lg:pt-40 pb-20 max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-12 z-10 min-h-[90vh]">
        
        {/* Left Column - Typography & Narrative */}
        <div className="flex-1 space-y-8 animate-slide-up text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/5 text-brand-teal text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
            Next-Generation Mobility Analytics
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-brand-deep leading-[1.1] tracking-tight">
            Command The Future Of <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-cyan">
              Smart Transportation
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-brand-slate max-w-2xl leading-relaxed mx-auto lg:mx-0 font-medium">
            Step into the central intelligence hub. Ridelytics fuses real-time operational data, AI-driven insights, and immersive visualization to give you absolute control over your urban mobility ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <button onClick={() => window.location.href = '/login'} className="w-full sm:w-auto relative group block cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-teal to-brand-cyan rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-200"></div>
              <div className="w-full relative px-8 py-4 bg-brand-deep text-white text-lg font-semibold rounded-xl hover:bg-brand-navy transition-all shadow-lg flex items-center justify-center gap-3">
                Access Admin Panel
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column - Holographic UI Elements */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none animate-float">
          {/* Main Hero Device/Car Graphic */}
          <div className="relative z-10 w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
            <Image
              src="/images/hero-car.png"
              alt="Intelligent Mobility"
              width={800}
              height={600}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Floating Data Glass Panels */}
          <div className="absolute top-10 -left-8 lg:-left-20 glass-panel p-4 flex items-center gap-4 animate-float-delayed z-20">
            <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center border border-brand-teal/20">
              <Image src="/images/icon-car.png" alt="" width={24} height={24} className="opacity-80" />
            </div>
            <div>
              <div className="text-xs text-brand-teal uppercase tracking-wider font-bold">Active Fleet</div>
              <div className="text-2xl font-bold text-brand-deep">{kpis ? formatNumber(kpis.totalTrips) : '128,540'}</div>
            </div>
          </div>

          <div className="absolute bottom-20 -right-4 lg:-right-12 glass-panel p-4 flex items-center gap-4 animate-float z-20" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 rounded-full bg-semantic-positive/10 flex items-center justify-center border border-semantic-positive/20">
              <Image src="/images/icon-dollar.png" alt="" width={24} height={24} className="opacity-80" />
            </div>
            <div>
              <div className="text-xs text-semantic-positive uppercase tracking-wider font-bold">Live Revenue</div>
              <div className="text-2xl font-bold text-brand-deep">{kpis ? formatCurrency(kpis.totalRevenue) : '$2.45M'}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Atmospheric Transition to next section */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent z-20"></div>
    </section>
  );
}
