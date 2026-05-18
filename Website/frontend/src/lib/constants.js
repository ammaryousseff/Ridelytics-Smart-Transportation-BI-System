// ============================================
// Ridelytics Frontend - Constants
// Entity configs mirrored from backend
// ============================================

export const ENTITY_LIST = [
  { key: 'drivers', label: 'Drivers', icon: '🚗', color: 'brand-teal' },
  { key: 'riders', label: 'Riders', icon: '🧑', color: 'brand-cyan' },
  { key: 'trips', label: 'Trips', icon: '🛣️', color: 'domain-operational' },
  { key: 'vehicles', label: 'Vehicles', icon: '🚙', color: 'brand-dark-navy' },
  { key: 'payments', label: 'Payments', icon: '💳', color: 'domain-financial' },
  { key: 'zones', label: 'Zones', icon: '📍', color: 'domain-geographic' },
  { key: 'ratings', label: 'Ratings', icon: '⭐', color: 'semantic-warning' },
  { key: 'complaints', label: 'Complaints', icon: '📋', color: 'semantic-negative' },
  { key: 'promotions', label: 'Promotions', icon: '🎁', color: 'domain-customer' },
  { key: 'seasonalpatterns', label: 'Seasonal Patterns', icon: '🌤️', color: 'semantic-info' },
  { key: 'surgerules', label: 'Surge Rules', icon: '⚡', color: 'semantic-warning' },
  { key: 'driverearnings', label: 'Driver Earnings', icon: '💰', color: 'domain-financial' },
];

export const STATUS_COLORS = {
  Active: 'badge-success',
  Completed: 'badge-success',
  Resolved: 'badge-success',
  Closed: 'badge-neutral',
  Inactive: 'badge-neutral',
  Suspended: 'badge-danger',
  Cancelled: 'badge-danger',
  Failed: 'badge-danger',
  Escalated: 'badge-danger',
  Critical: 'badge-danger',
  Pending: 'badge-warning',
  'In Progress': 'badge-warning',
  Requested: 'badge-info',
  Accepted: 'badge-info',
  Open: 'badge-info',
  Expired: 'badge-neutral',
  Disabled: 'badge-neutral',
  Refunded: 'badge-warning',
  High: 'badge-danger',
  Medium: 'badge-warning',
  Low: 'badge-info',
};

export const DASHBOARD_CATEGORIES = [
  {
    title: 'Executive Overview',
    description: 'High-level KPIs, revenue trends, and strategic insights for decision-makers.',
    icon: '📊',
    color: '#0D2137',
    gradient: 'from-[#0D2137] to-[#1a3a5c]',
  },
  {
    title: 'Operational Metrics',
    description: 'Real-time trip data, driver performance, fleet utilization, and zone activity.',
    icon: '⚙️',
    color: '#0E7C86',
    gradient: 'from-[#0E7C86] to-[#12a3b0]',
  },
  {
    title: 'Financial Analytics',
    description: 'Revenue breakdowns, payment analysis, commission tracking, and profitability.',
    icon: '💰',
    color: '#C9962A',
    gradient: 'from-[#C9962A] to-[#e0b84d]',
  },
  {
    title: 'Customer Intelligence',
    description: 'Rider satisfaction, complaint resolution, ratings analysis, and churn prediction.',
    icon: '👥',
    color: '#7B2D8B',
    gradient: 'from-[#7B2D8B] to-[#a44db8]',
  },
  {
    title: 'Geographic Insights',
    description: 'Zone-based analytics, heat maps, popular routes, and regional demand patterns.',
    icon: '🗺️',
    color: '#1B6B3A',
    gradient: 'from-[#1B6B3A] to-[#2a9d56]',
  },
];

export const FEATURES = [
  {
    title: 'AI-Powered Workflows',
    description: 'Automated complaint classification, churn prediction, and smart routing using n8n AI agents.',
    icon: '🤖',
  },
  {
    title: 'Smart Analytics',
    description: 'Real-time dashboards with KPIs, trend analysis, and predictive insights for data-driven decisions.',
    icon: '📈',
  },
  {
    title: 'Real-time Insights',
    description: 'Live monitoring of trips, driver activity, and zone performance with instant alerting.',
    icon: '⚡',
  },
  {
    title: 'BI Dashboards',
    description: 'Interactive Power BI-style visualizations covering executive, operational, and financial views.',
    icon: '📊',
  },
  {
    title: 'n8n Automation',
    description: 'Seamless integration with n8n workflows for email alerts, report generation, and re-engagement.',
    icon: '🔄',
  },
  {
    title: 'Natural Language Querying',
    description: 'Ask questions in plain English or Arabic and get instant insights from your transportation data.',
    icon: '💬',
  },
];
