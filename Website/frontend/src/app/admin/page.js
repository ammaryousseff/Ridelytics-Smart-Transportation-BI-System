'use client';
import { useEffect, useState } from 'react';
import { formatNumber, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import api from '@/lib/api';

export default function DashboardOverview() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKPIs() {
      try {
        const data = await api.get('/api/dashboard/kpis');
        if (data.success) {
          setKpis(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch KPIs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-brand-light border-t-brand-teal rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Trips', value: formatNumber(kpis?.totalTrips || 0), icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, color: 'text-brand-teal', bg: 'bg-brand-teal/10 border-brand-teal/20' },
    { label: 'Revenue', value: formatCurrency(kpis?.totalRevenue || 0), icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-semantic-positive', bg: 'bg-semantic-positive/10 border-semantic-positive/20' },
    { label: 'Drivers', value: formatNumber(kpis?.activeDrivers || 0), icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10 border-brand-cyan/20' },
    { label: 'Riders', value: formatNumber(kpis?.activeRiders || 0), icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, color: 'text-semantic-info', bg: 'bg-semantic-info/10 border-semantic-info/20' },
    { label: 'Avg Rating', value: parseFloat(kpis?.avgRating || 0).toFixed(2), icon: <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>, color: 'text-semantic-warning', bg: 'bg-semantic-warning/10 border-semantic-warning/20' },
    { label: 'Cancel Rate', value: `${kpis?.cancellationRate || 0}%`, icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, color: 'text-semantic-negative', bg: 'bg-semantic-negative/10 border-semantic-negative/20' },
  ];

  const recentTrips = [
    { id: 1, rider: 'Heba Gad', driver: 'Hamdi Gad', status: 'Cancelled', amount: 0, date: 'Just now' },
    { id: 2, rider: 'Rasha Gad', driver: 'Walid Nasr', status: 'Completed', amount: 85, date: '5m ago' },
    { id: 3, rider: 'Fatma Kamel', driver: 'Sami Nasr', status: 'Completed', amount: 313.59, date: '12m ago' },
    { id: 4, rider: 'Fady Reda', driver: 'Reem Abdel-Rahman', status: 'Completed', amount: 100, date: '18m ago' },
  ];

  const topDrivers = [
    { id: 1, name: 'Tarek Ismail', trips: 39, earnings: 7741.57, rating: 4.3 },
    { id: 2, name: 'Mansour Ismail', trips: 37, earnings: 7447.25, rating: 4.8 },
    { id: 3, name: 'Youssef Reda', trips: 38, earnings: 7327.52, rating: 4.5 },
    { id: 4, name: 'Khaled Helmy', trips: 37, earnings: 6887.65, rating: 4.7 },
  ];

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white/40 p-6 rounded-2xl border border-brand-light/50 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-brand-deep tracking-tight">Executive Dashboard</h1>
        <p className="text-brand-slate font-medium mt-2">Live telemetry and holistic performance metrics.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="glass-panel bg-white p-6 hover:shadow-glass-lg hover:-translate-y-1.5 transition-all duration-300 group border border-brand-light/70 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-20 ${kpi.bg.split(' ')[0]} transition-transform group-hover:scale-150 duration-500 pointer-events-none`} />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${kpi.bg} group-hover:scale-110 transition-transform duration-300`}>
                <div className={`w-6 h-6 ${kpi.color}`}>
                  {kpi.icon}
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-brand-teal bg-brand-light/50 px-2.5 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                Live
              </span>
            </div>
            
            <div className="relative z-10 w-full overflow-hidden">
              <h3 className="text-2xl font-extrabold text-brand-deep mb-1 tracking-tight truncate" title={kpi.value}>{kpi.value}</h3>
              <p className="text-brand-slate text-xs font-bold uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Trips */}
        <div className="glass-panel bg-white p-8 border border-brand-light/70 shadow-sm flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-light/50">
            <div>
              <h3 className="text-xl font-bold text-brand-deep">Live Trip Feed</h3>
              <p className="text-xs text-brand-slate mt-1 font-medium uppercase tracking-wider">Real-time status</p>
            </div>
            <Link href="/admin/trips" className="btn-primary py-2 px-4 text-xs">
              View Database
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 rounded-xl bg-brand-soft-white/30 hover:bg-white border border-brand-light/50 hover:border-brand-teal/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-deep">{trip.rider}</p>
                    <p className="text-xs font-semibold text-brand-slate mt-0.5">{trip.driver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                    trip.status === 'Completed' ? 'bg-semantic-positive/10 text-semantic-positive' : 'bg-semantic-negative/10 text-semantic-negative'
                  }`}>
                    {trip.status}
                  </span>
                  <p className="text-sm font-extrabold text-brand-deep">{trip.amount > 0 ? `EGP ${trip.amount}` : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Drivers */}
        <div className="glass-panel bg-white p-8 border border-brand-light/70 shadow-sm flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-light/50">
            <div>
              <h3 className="text-xl font-bold text-brand-deep">Top Performers</h3>
              <p className="text-xs text-brand-slate mt-1 font-medium uppercase tracking-wider">Driver Leaderboard</p>
            </div>
            <Link href="/admin/drivers" className="btn-primary py-2 px-4 text-xs">
              View Directory
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {topDrivers.map((driver, index) => (
              <div key={driver.id} className="flex items-center justify-between p-4 rounded-xl bg-brand-soft-white/30 hover:bg-white border border-brand-light/50 hover:border-semantic-warning/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-sm transition-transform group-hover:scale-105 ${
                    index === 0 ? 'bg-gradient-to-br from-semantic-warning to-yellow-600 shadow-semantic-warning/30' : 
                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 
                    index === 2 ? 'bg-gradient-to-br from-[#cd7f32] to-[#8b5a2b]' : 'bg-brand-light text-brand-slate'
                  }`}>
                    {index === 0 ? '👑' : `#${index + 1}`}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-deep">{driver.name}</p>
                    <p className="text-xs font-semibold text-brand-slate mt-0.5">{driver.trips} verified trips</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-brand-deep">EGP {formatNumber(driver.earnings)}</p>
                  <p className="text-xs font-bold text-semantic-warning flex items-center justify-end gap-1 mt-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {driver.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
