'use client';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
  {
    title: 'Executive',
    count: 1,
    icon: '/images/icon-executive.png',
    description: 'High-level synthesis of market pulse, revenue trajectories, and global growth metrics.',
    href: '/login',
    color: 'from-brand-teal to-brand-cyan',
  },
  {
    title: 'Operational',
    count: 7,
    icon: '/images/icon-operational.png',
    description: 'Real-time telemetry on fleet distribution, driver efficiency, and dynamic supply-demand.',
    href: '/login',
    color: 'from-semantic-warning to-orange-400',
  },
  {
    title: 'Financial',
    count: 5,
    icon: '/images/icon-finance.png',
    description: 'Deep dive into revenue streams, profit margins, pricing volatility, and payout flows.',
    href: '/login',
    color: 'from-semantic-positive to-emerald-400',
  },
  {
    title: 'Customer',
    count: 4,
    icon: '/images/icon-customer.png',
    description: 'Behavioral insights, retention modeling, satisfaction mapping, and churn prevention.',
    href: '/login',
    color: 'from-purple-500 to-indigo-400',
  },
  {
    title: 'Geographical',
    count: 4,
    icon: '/images/icon-geographical.png',
    description: 'Spatial analytics, zone density, expansion targeting, and travel corridor flow.',
    href: '/login',
    color: 'from-brand-slate to-gray-400',
  },
];

export default function Categories() {
  return (
    <section className="relative bg-white py-24 px-6 lg:px-10 z-10 border-t border-brand-light/50">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-brand-light/50 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-deep mb-6 tracking-tight">
            Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-cyan">Matrix</span>
          </h2>
          <p className="text-brand-slate text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Navigate the complexities of modern mobility through five interconnected dimensional dashboards. Pure data translated into strategic power.
          </p>
        </div>

        {/* Category Nodes (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group relative glass-panel p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg hover:border-brand-teal/30 overflow-hidden flex flex-col h-full bg-white"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Hover Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
              
              {/* Glowing Top Line */}
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${cat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />

              {/* Icon Container */}
              <div className="relative w-14 h-14 mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} rounded-xl opacity-10 blur-sm group-hover:opacity-20 transition-opacity`} />
                <div className="relative w-full h-full rounded-xl border border-brand-teal/10 bg-white flex items-center justify-center shadow-sm">
                  <Image src={cat.icon} alt="" width={24} height={24} className="opacity-80 group-hover:opacity-100 transition-opacity" style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(50%) saturate(1000%) hue-rotate(170deg)' }} />
                </div>
              </div>

              {/* Title & Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-brand-deep font-bold text-lg tracking-wide truncate">{cat.title}</h3>
                <span className={`shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-brand-light text-brand-teal text-xs font-bold border border-brand-teal/10 group-hover:bg-brand-teal/10 group-hover:text-brand-teal transition-all`}>
                  {cat.count} modules
                </span>
              </div>

              {/* Description */}
              <p className="text-brand-slate text-sm leading-relaxed mb-6 flex-grow font-medium">
                {cat.description}
              </p>

              {/* CTA */}
              <div className="mt-auto pt-4 border-t border-brand-light flex items-center justify-between text-brand-teal text-sm font-bold">
                <span className="tracking-wider uppercase text-[10px] group-hover:text-brand-cyan transition-colors">Initialize</span>
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Global Control Tip */}
        <div className="mt-16 max-w-3xl mx-auto glass-panel px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-6 border-brand-teal/10 bg-white/80">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 flex items-center justify-center bg-brand-teal/10 rounded-full">
              <span className="absolute inset-0 rounded-full border border-brand-teal/30 animate-ping opacity-40"></span>
              <svg className="w-5 h-5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <span className="block text-brand-deep font-bold text-sm tracking-wide">System Architect Tip</span>
              <p className="text-brand-slate text-sm font-medium mt-0.5">Deploy the global navigation matrix from any dashboard context to seamlessly shift between analytical dimensions.</p>
            </div>
          </div>
          <Link href="/login" className="shrink-0 px-5 py-2.5 rounded-lg bg-brand-deep border border-transparent text-white text-sm font-semibold hover:bg-brand-navy hover:shadow-lg transition-all">
            Engage System All
          </Link>
        </div>
      </div>
    </section>
  );
}
