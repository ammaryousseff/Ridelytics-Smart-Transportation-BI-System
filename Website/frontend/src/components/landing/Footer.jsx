import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-brand-deep pt-20 pb-10 overflow-hidden z-10 border-t border-brand-teal/20">
      {/* Subtle Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-cyan/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Identity */}
          <div className="md:col-span-2 space-y-6">
            <Image src="/images/logo.png" alt="Ridelytics" width={180} height={48} className="h-10 w-auto" />
            <p className="text-white/60 text-sm font-light leading-relaxed max-w-md">
              The intelligence engine behind tomorrow's urban mobility. We transform massive data streams into precision strategic instruments for visionary transportation leaders.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-cyan/20 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all cursor-pointer text-white/60">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-cyan/20 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all cursor-pointer text-white/60">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </div>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div>
            <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-[0.2em] opacity-80">Platform</h3>
            <ul className="space-y-3">
              {[
                { label: 'Executive Terminal', href: '/login' },
                { label: 'Entity Governance', href: '/login' },
                { label: 'Cognitive Core (AI)', href: '/login' },
                { label: 'System Access', href: '/login' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/50 hover:text-brand-cyan text-sm font-light transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-brand-cyan/50 group-hover:bg-brand-cyan transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Domains */}
          <div>
            <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-[0.2em] opacity-80">Domains</h3>
            <ul className="space-y-3">
              {['Executive', 'Operational', 'Financial', 'Customer', 'Geographical'].map((cat) => (
                <li key={cat} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/50 text-sm font-light">{cat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Global Footer Divider */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs font-light tracking-wide">
            © {new Date().getFullYear()} Ridelytics Nexus. ITI BI Track Graduation Project.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-xs font-light">
            <span className="w-2 h-2 rounded-full bg-semantic-positive animate-pulse" />
            Core Systems Online
          </div>
        </div>
      </div>
    </footer>
  );
}
