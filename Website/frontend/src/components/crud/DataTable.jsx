'use client';
import { useState, useEffect } from 'react';
import { formatNumber, formatCurrency, formatDate } from '@/lib/utils';
import api from '@/lib/api';

export default function DataTable({ endpoint, title }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [endpoint, page, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const json = await api.get(`/api/crud/${endpoint}?page=${page}&limit=${pageSize}&search=${searchTerm}`);
      
      if (json.success) {
        setData(json.data);
        setTotal(json.pagination.total);
        if (json.data.length > 0 && columns.length === 0) {
          const cols = Object.keys(json.data[0]).filter(k => k !== 'password');
          setColumns(cols);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const formatCellContent = (key, value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('created') || key.toLowerCase().includes('updated') || key.toLowerCase().includes('time')) {
      return formatDate(value);
    }
    if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('earnings')) {
      return formatCurrency(value);
    }
    if (typeof value === 'number' && value > 1000 && !key.toLowerCase().includes('id')) {
      return formatNumber(value);
    }
    return String(value);
  };

  return (
    <div className="glass-panel bg-white overflow-hidden flex flex-col h-full min-h-[600px] border border-brand-light shadow-sm">
      
      {/* Table Header */}
      <div className="p-6 border-b border-brand-light flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-deep flex items-center gap-3">
            {title}
            <span className="px-2.5 py-1 bg-brand-light text-brand-teal text-xs rounded-md">Live</span>
          </h2>
          <p className="text-brand-slate text-sm font-medium mt-1">{total} records found</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-light bg-brand-soft-white text-sm focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button className="shrink-0 btn-primary px-4 py-2.5 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Add Record</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col.replace(/_/g, ' ')}</th>
              ))}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-4 border-brand-light border-t-brand-teal rounded-full animate-spin"></div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-20 text-brand-slate font-medium">
                  No records found matching your criteria.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col} className="whitespace-nowrap font-medium text-brand-deep">
                      {formatCellContent(col, row[col])}
                    </td>
                  ))}
                  <td className="whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-brand-teal hover:bg-brand-teal/10 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button className="p-1.5 text-semantic-negative hover:bg-semantic-negative/10 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-brand-light flex items-center justify-between bg-brand-soft-white/50">
        <span className="text-sm font-medium text-brand-slate">
          Showing {data.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, total)} of {total} records
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-brand-light bg-white text-brand-slate hover:text-brand-teal hover:border-brand-teal disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="px-4 py-2 rounded-xl bg-white border border-brand-light text-sm font-bold text-brand-deep">
            {page} / {Math.ceil(total / pageSize) || 1}
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / pageSize)}
            className="p-2 rounded-xl border border-brand-light bg-white text-brand-slate hover:text-brand-teal hover:border-brand-teal disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
