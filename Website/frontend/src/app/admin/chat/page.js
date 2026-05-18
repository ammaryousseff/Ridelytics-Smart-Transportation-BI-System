'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamically import Recharts to avoid SSR issues
const RechartsComponents = dynamic(
  () => import('@/components/admin/ChatCharts'),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-brand-slate text-sm">Loading chart...</div> }
);

const SUGGESTED_PROMPTS = [
  { text: "What's today's revenue?", icon: '💰' },
  { text: 'Show top 5 drivers by earnings', icon: '🏆' },
  { text: 'How many trips were cancelled this month?', icon: '📊' },
  { text: 'ما هي أكثر المناطق ازدحاماً؟', icon: '🗺️' },
  { text: 'List all open complaints', icon: '📋' },
  { text: 'What is the average trip distance?', icon: '🛣️' },
];

// ── KPI Card ──────────────────────────────────────
function KPICard({ columns, data }) {
  if (!data || data.length === 0) return null;
  const row = data[0];
  const key = columns[0];
  const value = row[key];

  // Format the value
  const formatted = typeof value === 'number'
    ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : value;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-deep via-brand-teal to-brand-cyan p-6 text-white shadow-glass-lg">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5 blur-lg" />
      <p className="text-sm font-medium text-white/70 uppercase tracking-wider mb-2">{key}</p>
      <p className="text-4xl font-bold tracking-tight">{formatted}</p>
    </div>
  );
}

// ── Data Table ────────────────────────────────────
function DataTable({ columns, data }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    return [...data].sort((a, b) => {
      const va = a[sortCol], vb = b[sortCol];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [data, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  if (!data || data.length === 0) return <p className="text-brand-slate text-sm">No data returned.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-brand-deep/5 to-brand-teal/5">
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className="px-4 py-3 text-left font-semibold text-brand-deep cursor-pointer select-none hover:text-brand-teal transition-colors whitespace-nowrap"
              >
                <span className="flex items-center gap-1">
                  {col}
                  {sortCol === col && (
                    <span className="text-brand-teal text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map((row, i) => (
            <tr key={i} className="hover:bg-brand-light/40 transition-colors">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                  {row[col] != null
                    ? typeof row[col] === 'number'
                      ? row[col].toLocaleString('en-US', { maximumFractionDigits: 2 })
                      : String(row[col])
                    : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── SQL Preview ───────────────────────────────────
function SQLPreview({ sql }) {
  const [open, setOpen] = useState(false);
  if (!sql) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-teal hover:text-brand-deep transition-colors"
      >
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {open ? 'Hide SQL' : 'Show SQL'}
      </button>
      {open && (
        <div className="mt-2 rounded-lg bg-brand-deep/95 text-green-300 p-4 font-mono text-xs leading-relaxed overflow-x-auto shadow-glass animate-fade-in">
          <pre className="whitespace-pre-wrap">{sql}</pre>
        </div>
      )}
    </div>
  );
}

// ── Response Renderer ─────────────────────────────
function ResponseRenderer({ response }) {
  const { success, chartType, columns, data, sql, explanation, userMessage, executionTimeMs, rowCount, fallback, error } = response;

  // ── Error / Failure state ───────────────────────
  if (success === false || chartType === 'error') {
    return (
      <div className="space-y-3 w-full">
        {/* User-friendly error message */}
        <div className="flex items-start gap-3 rounded-xl bg-red-50/80 border border-red-100 p-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-800 leading-relaxed">
              {userMessage || error || 'An error occurred while processing your query.'}
            </p>
            {/* Technical error detail (collapsed) */}
            {error && userMessage && error !== userMessage && (
              <details className="mt-2">
                <summary className="text-xs text-red-400 cursor-pointer hover:text-red-600 transition-colors">
                  Technical details
                </summary>
                <p className="mt-1 text-xs text-red-400 font-mono bg-red-50 rounded px-2 py-1">
                  {error}
                </p>
              </details>
            )}
          </div>
        </div>

        {/* Show the failed SQL if available */}
        <SQLPreview sql={sql} />

        {fallback && (
          <div className="flex items-center gap-1.5 text-[11px] text-semantic-warning">
            <span>⚡</span>
            <span>Offline response — n8n service unreachable</span>
          </div>
        )}
      </div>
    );
  }

  // ── Success state ───────────────────────────────
  return (
    <div className="space-y-3 w-full">
      {/* Explanation text */}
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{explanation}</p>

      {/* KPI */}
      {chartType === 'kpi' && data?.length > 0 && (
        <KPICard columns={columns} data={data} />
      )}

      {/* Charts */}
      {['bar', 'line', 'pie'].includes(chartType) && data?.length > 0 && (
        <RechartsComponents chartType={chartType} columns={columns} data={data} />
      )}

      {/* Map indicator */}
      {chartType === 'map' && data?.length > 0 && (
        <div className="rounded-xl border border-brand-teal/20 bg-brand-light p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🗺️</span>
            <span className="font-semibold text-brand-deep text-sm">Geographical Data</span>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      )}

      {/* Table — show for table type, or as supplemental for charts with many rows */}
      {(chartType === 'table' || (data?.length > 0 && !['kpi', 'error'].includes(chartType))) && data?.length > 0 && (
        <DataTable columns={columns} data={data} />
      )}

      {/* Metadata footer */}
      <div className="flex items-center gap-4 text-[11px] text-brand-slate pt-1">
        {rowCount != null && rowCount > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            {rowCount} row{rowCount !== 1 ? 's' : ''}
          </span>
        )}
        {executionTimeMs != null && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {executionTimeMs}ms
          </span>
        )}
        {fallback && (
          <span className="text-semantic-warning flex items-center gap-1">⚡ Offline response</span>
        )}
      </div>

      {/* SQL Preview */}
      <SQLPreview sql={sql} />
    </div>
  );
}

// ══════════════════════════════════════════════════
// MAIN CHAT PAGE
// ══════════════════════════════════════════════════
export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: "Hello! 👋 I'm the Ridelytics AI Assistant. Ask me anything about your transportation data — trips, drivers, revenue, zones, or complaints. I support both English and Arabic!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const isArabic = /[\u0600-\u06FF]/.test(text);
      const res = await api.post('/api/chat/message', {
        message: text.trim(),
        language: isArabic ? 'ar' : 'en',
      });

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: null, // We use structured response instead
        response: res, // Full structured response from n8n
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: `Sorry, an error occurred: ${err.message}`,
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark-navy flex items-center gap-2">
            🤖 AI Assistant
          </h1>
          <p className="text-brand-slate text-sm mt-1">
            Ask questions about your transportation data in English or Arabic
          </p>
        </div>
        <button
          onClick={() =>
            setMessages([{
              id: 'welcome',
              role: 'bot',
              text: "Chat cleared! How can I help you?",
              timestamp: new Date(),
            }])
          }
          className="btn-ghost btn-sm"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-2xl shadow-card flex flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div className={`${msg.role === 'user' ? 'max-w-[80%] sm:max-w-[65%]' : 'max-w-[95%] sm:max-w-[85%]'} ${msg.role === 'user' ? 'order-2' : ''}`}>
                {/* User message bubble */}
                {msg.role === 'user' && (
                  <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-gradient-to-br from-brand-teal to-brand-cyan text-white rounded-br-md">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                )}

                {/* Bot message — plain text (welcome, errors) */}
                {msg.role === 'bot' && msg.text && !msg.response && (
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.error
                      ? 'bg-red-50 text-red-700 border border-red-100 rounded-bl-md'
                      : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-md'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                )}

                {/* Bot message — structured n8n response */}
                {msg.role === 'bot' && msg.response && (
                  <div className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 rounded-bl-md">
                    <ResponseRenderer response={msg.response} />
                  </div>
                )}

                <div className={`text-[10px] text-gray-400 mt-1 ${
                  msg.role === 'user' ? 'text-right' : ''
                }`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {sending && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5 items-center">
                  <span className="text-xs text-brand-slate mr-2">Querying database</span>
                  <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-brand-slate mb-2 font-medium">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt.text)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-light text-brand-dark-navy text-sm
                    hover:bg-brand-teal hover:text-white transition-all duration-200 border border-brand-teal/10"
                >
                  <span>{prompt.icon}</span>
                  <span className="truncate">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={sending}
              className="form-input flex-1"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="btn-primary px-5 disabled:opacity-40"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
