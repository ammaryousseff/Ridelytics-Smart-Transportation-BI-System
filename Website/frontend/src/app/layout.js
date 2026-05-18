import '@/styles/globals.css';

export const metadata = {
  title: 'Ridelytics — Smart Transportation Business Intelligence',
  description: 'Ridelytics is a next-generation BI dashboard for transportation companies. Real-time analytics, AI-powered insights, and smart automation for rideshare operations.',
  keywords: 'transportation, business intelligence, analytics, dashboard, rideshare, BI, AI',
  authors: [{ name: 'Ridelytics Team' }],
  openGraph: {
    title: 'Ridelytics — Smart Transportation BI',
    description: 'Real-time analytics and AI-powered insights for transportation companies.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
