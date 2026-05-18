'use client';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

// ── Brand-aligned color palette ──────────────────
const COLORS = [
  '#0A7C8C', // brand-teal
  '#20B2BF', // brand-cyan
  '#0D3B4E', // brand-deep
  '#F59E0B', // semantic-warning
  '#3B82F6', // semantic-info
  '#10B981', // emerald
  '#8B5CF6', // purple
  '#EF4444', // red
  '#EC4899', // pink
  '#F97316', // orange
];

// Custom tooltip style
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-brand-deep/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-glass-lg border border-white/10">
      <p className="text-white/70 text-xs font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color || '#20B2BF' }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function ChatCharts({ chartType, columns, data }) {
  if (!data || data.length === 0) return null;

  // Identify label column (first non-numeric or first column)
  // and value columns (numeric ones)
  const labelCol = columns.find(c => {
    const sample = data[0][c];
    return typeof sample === 'string' || sample === null;
  }) || columns[0];

  const valueColumns = columns.filter(c => {
    if (c === labelCol) return false;
    return data.some(row => typeof row[c] === 'number');
  });

  // If no numeric columns found, use all non-label columns
  const dataCols = valueColumns.length > 0 ? valueColumns : columns.filter(c => c !== labelCol);

  // ── BAR CHART ───────────────────────────────────
  if (chartType === 'bar') {
    return (
      <div className="w-full h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={labelCol}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              tickFormatter={(v) => typeof v === 'number' ? v.toLocaleString() : v}
            />
            <Tooltip content={<CustomTooltip />} />
            {dataCols.length > 1 && <Legend />}
            {dataCols.map((col, i) => (
              <Bar
                key={col}
                dataKey={col}
                fill={COLORS[i % COLORS.length]}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── LINE CHART ──────────────────────────────────
  if (chartType === 'line') {
    return (
      <div className="w-full h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={labelCol}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              tickFormatter={(v) => typeof v === 'number' ? v.toLocaleString() : v}
            />
            <Tooltip content={<CustomTooltip />} />
            {dataCols.length > 1 && <Legend />}
            {dataCols.map((col, i) => (
              <Line
                key={col}
                type="monotone"
                dataKey={col}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2.5}
                dot={{ fill: COLORS[i % COLORS.length], r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── PIE CHART ───────────────────────────────────
  if (chartType === 'pie') {
    const valueCol = dataCols[0] || columns[1];
    const pieData = data.map(row => ({
      name: String(row[labelCol] || 'Unknown'),
      value: Number(row[valueCol]) || 0,
    }));

    return (
      <div className="w-full h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={45}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
