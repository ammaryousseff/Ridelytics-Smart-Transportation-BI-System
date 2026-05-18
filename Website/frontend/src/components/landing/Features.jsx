'use client';

const FEATURES = [
  {
    title: 'Live Telemetry Core',
    description: 'Monitor fleet dynamics, revenue streams, and behavioral metrics in absolute real-time through an optimized data pipeline.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
    color: 'text-brand-cyan',
    bg: 'bg-brand-cyan/10 border-brand-cyan/20'
  },
  {
    title: 'Cognitive Assistant',
    description: 'Query your entire operational database using natural language. The AI agent translates complex queries into instant strategic answers.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    color: 'text-semantic-info',
    bg: 'bg-semantic-info/10 border-semantic-info/20'
  },
  {
    title: 'Dimensional Analytics',
    description: 'Unpack performance across 21 specialized sectors mapping operational efficiency, financial health, and geographical dominance.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    ),
    color: 'text-semantic-positive',
    bg: 'bg-semantic-positive/10 border-semantic-positive/20'
  },
  {
    title: 'Entity Governance',
    description: 'Execute absolute command over 12 structural entities through an advanced, secure management interface.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    ),
    color: 'text-brand-teal',
    bg: 'bg-brand-teal/10 border-brand-teal/20'
  },
];

export default function Features() {
  return (
    <section className="relative bg-white py-24 px-6 lg:px-10 z-10 overflow-hidden border-t border-brand-light">
      
      {/* Structural Divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-teal/20 to-transparent max-w-5xl mx-auto" />

      {/* Atmospheric Backgrounds */}
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-brand-light/50 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Narrative Column */}
          <div className="w-full lg:w-1/3 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-deep tracking-tight">
              Operational <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-cyan">
                Supremacy
              </span>
            </h2>
            <p className="text-brand-slate text-lg font-medium leading-relaxed">
              Engineered for absolute performance. The Ridelytics platform consolidates disparate data streams into a unified, high-fidelity command structure.
            </p>
            <div className="pt-4 flex justify-center lg:justify-start">
              <button className="px-6 py-3 rounded-xl border border-brand-teal/20 text-brand-teal font-bold hover:bg-brand-teal/5 transition-colors flex items-center gap-2">
                Explore Architecture 
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>

          {/* Grid Column */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="group glass-panel bg-white p-8 hover:bg-brand-soft-white transition-all duration-500 border-brand-light relative overflow-hidden"
              >
                {/* Cyber corner accents */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-brand-cyan/40 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${feat.bg} ${feat.color} group-hover:scale-110 transition-transform duration-500`}>
                  {feat.icon}
                </div>
                
                <h3 className="text-brand-deep font-bold text-lg mb-3 tracking-wide">{feat.title}</h3>
                <p className="text-brand-slate text-sm font-medium leading-relaxed group-hover:text-brand-navy transition-colors">{feat.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
