'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import { useCrud } from '@/hooks/useCrud';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/ui/Modal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { formatDate, formatDateTime, formatCurrency, debounce, truncate } from '@/lib/utils';
import { STATUS_COLORS, ENTITY_LIST } from '@/lib/constants';
import api from '@/lib/api';

export default function CrudPage() {
  const params = useParams();
  const entity = params.entity;
  const entityInfo = ENTITY_LIST.find((e) => e.key === entity);
  const toast = useToast();
  const { create, update, remove, loading: crudLoading } = useCrud(entity);

  // State
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('ASC');
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  // Fetch config
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await api.get(`/api/crud/${entity}/config`);
        setConfig(res.config);
      } catch (err) {
        toast.error('Failed to load entity config');
      }
    }
    if (entity) loadConfig();
  }, [entity]);

  // Fetch records
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(sortBy && { sortBy, sortOrder }),
      });
      const res = await api.get(`/api/crud/${entity}?${params}`);
      setRecords(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [entity, page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    if (entity) fetchRecords();
  }, [fetchRecords, entity]);

  // Handlers
  const handleSearch = debounce((val) => {
    setSearch(val);
    setPage(1);
  }, 400);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  const openCreate = () => {
    setFormData({});
    setModalMode('create');
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setFormData({ ...record });
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await create(formData);
      } else {
        const pk = config?.primaryKey;
        await update(formData[pk], formData);
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      // Error already handled by useCrud
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deleteModal.id);
      setDeleteModal({ open: false, id: null });
      fetchRecords();
    } catch (err) {
      // Error already handled by useCrud
    }
  };

  const formatCellValue = (value, col) => {
    if (value === null || value === undefined) return '—';
    if (col.type === 'boolean' || col.type === 'bit') return value ? '✅' : '❌';
    if (col.type === 'date') return formatDate(value);
    if (col.type === 'datetime') return formatDateTime(value);
    if (col.key.includes('Fare') || col.key.includes('Earning') || col.key.includes('Commission') || col.key.includes('Amount') || col.key.includes('Bonus')) {
      return formatCurrency(value);
    }
    if (typeof value === 'string' && value.length > 60) return truncate(value, 60);
    return String(value);
  };

  // Visible columns (limit to reasonable number for table)
  const visibleColumns = config?.columns?.slice(0, 8) || [];
  const allColumns = config?.columns || [];

  return (
    <>
      <div className="glass-panel bg-white overflow-hidden flex flex-col h-full min-h-[800px] border border-brand-light shadow-glass-lg animate-fade-in mx-auto w-full">
      
      {/* Header */}
      <div className="p-8 border-b border-brand-light flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-brand-deep flex items-center gap-4">
            {config?.displayName || entity}
            <span className="px-3 py-1 bg-semantic-positive/10 text-semantic-positive text-xs rounded-full uppercase tracking-wider font-bold shadow-sm">Live Feed</span>
          </h1>
          <p className="text-brand-slate text-sm font-medium mt-2">{total} active records loaded</p>
        </div>
        <button onClick={openCreate} className="shrink-0 btn-primary px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-glow-teal hover:shadow-lg transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add New Record</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 bg-brand-soft-white/50 border-b border-brand-light flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`Search ${config?.displayName || ''}...`}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-light bg-white text-sm focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          />
        </div>
        <select
          value={limit}
          onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
          className="form-select w-full sm:w-auto text-sm py-2 bg-white"
        >
          <option value={10}>10 records per page</option>
          <option value={25}>25 records per page</option>
          <option value={50}>50 records per page</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none hover:text-brand-teal transition-colors"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortBy === col.key && (
                      <span className="text-brand-teal text-xs">{sortOrder === 'ASC' ? '▲' : '▼'}</span>
                    )}
                  </span>
                </th>
              ))}
              <th className="w-32 text-center text-brand-slate font-semibold tracking-wider text-xs uppercase px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRowSkeleton key={i} columns={visibleColumns.length + 1} />
              ))
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="text-center py-32 text-brand-slate font-medium">
                  <div className="text-5xl mb-4 opacity-40">📭</div>
                  No records found matching your criteria.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record[config?.primaryKey]} className="hover:bg-brand-teal/5 transition-all duration-300 group">
                  {visibleColumns.map((col) => (
                    <td key={col.key} className="font-medium text-brand-deep px-6 py-4">
                      {col.options && STATUS_COLORS[record[col.key]] ? (
                        <span className={`badge ${STATUS_COLORS[record[col.key]]} px-3 py-1 shadow-sm`}>
                          {record[col.key]}
                        </span>
                      ) : (
                        formatCellValue(record[col.key], col)
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => openEdit(record)}
                        className="p-2 rounded-xl bg-white border border-brand-light text-brand-teal hover:bg-brand-teal hover:text-white hover:border-brand-teal shadow-sm transition-all group-hover:shadow-md"
                        title="Edit Record"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, id: record[config?.primaryKey] })}
                        className="p-2 rounded-xl bg-white border border-brand-light text-semantic-negative hover:bg-semantic-negative hover:text-white hover:border-semantic-negative shadow-sm transition-all group-hover:shadow-md"
                        title="Delete Record"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
      {totalPages > 1 && (
        <div className="p-4 border-t border-brand-light flex items-center justify-between bg-brand-soft-white/50">
          <span className="text-sm font-medium text-brand-slate">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-brand-light bg-white text-brand-slate hover:text-brand-teal hover:border-brand-teal disabled:opacity-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page - 2 + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${
                    p === page ? 'bg-brand-teal border border-brand-teal text-white shadow-md' : 'bg-white border border-brand-light text-brand-slate hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-brand-light bg-white text-brand-slate hover:text-brand-teal hover:border-brand-teal disabled:opacity-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${modalMode === 'create' ? 'Create' : 'Edit'} ${config?.displayName?.slice(0, -1) || ''}`}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleSubmit} disabled={crudLoading} className="btn-primary">
              {crudLoading ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Update'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allColumns.map((col) => {
            // Skip primary key in edit mode (can't change PK)
            if (col.primaryKey && modalMode === 'edit') {
              return (
                <div key={col.key} className="sm:col-span-1">
                  <label className="form-label">{col.label}</label>
                  <input type="text" value={formData[col.key] || ''} disabled className="form-input bg-gray-50 cursor-not-allowed" />
                </div>
              );
            }

            if (col.type === 'select' && col.options) {
              return (
                <div key={col.key}>
                  <label className="form-label">
                    {col.label} {col.required && <span className="text-semantic-negative">*</span>}
                  </label>
                  <select
                    value={formData[col.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                    className="form-select"
                    required={col.required}
                  >
                    <option value="">Select...</option>
                    {col.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (col.type === 'textarea') {
              return (
                <div key={col.key} className="sm:col-span-2">
                  <label className="form-label">
                    {col.label} {col.required && <span className="text-semantic-negative">*</span>}
                  </label>
                  <textarea
                    value={formData[col.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                    className="form-input min-h-[80px] resize-y"
                    required={col.required}
                  />
                </div>
              );
            }

            if (col.type === 'boolean') {
              return (
                <div key={col.key} className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id={col.key}
                    checked={!!formData[col.key]}
                    onChange={(e) => setFormData({ ...formData, [col.key]: e.target.checked ? 1 : 0 })}
                    className="w-5 h-5 rounded-md border-gray-300 text-brand-teal focus:ring-brand-teal"
                  />
                  <label htmlFor={col.key} className="text-sm font-medium text-gray-700">{col.label}</label>
                </div>
              );
            }

            const inputType = col.type === 'number' ? 'number' :
                              col.type === 'date' ? 'date' :
                              col.type === 'datetime' ? 'datetime-local' :
                              col.type === 'email' ? 'email' :
                              col.type === 'time' ? 'time' : 'text';

            return (
              <div key={col.key}>
                <label className="form-label">
                  {col.label} {col.required && <span className="text-semantic-negative">*</span>}
                </label>
                <input
                  type={inputType}
                  value={formData[col.key] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                  className="form-input"
                  required={col.required}
                  step={col.type === 'number' ? 'any' : undefined}
                />
              </div>
            );
          })}
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModal({ open: false, id: null })} className="btn-ghost">Cancel</button>
            <button onClick={handleDelete} disabled={crudLoading} className="btn-danger">
              {crudLoading ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-gray-700">
            Are you sure you want to delete record <strong>#{deleteModal.id}</strong>?
          </p>
          <p className="text-sm text-brand-slate mt-2">This action cannot be undone.</p>
        </div>
      </Modal>
    </>
  );
}
