'use client';
import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export function useCrud(entity) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const create = useCallback(async (data) => {
    setLoading(true);
    try {
      const result = await api.post(`/api/crud/${entity}`, data);
      toast.success(result.message || 'Record created successfully');
      return result;
    } catch (err) {
      toast.error(err.message || 'Failed to create record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entity, toast]);

  const update = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const result = await api.put(`/api/crud/${entity}/${id}`, data);
      toast.success(result.message || 'Record updated successfully');
      return result;
    } catch (err) {
      toast.error(err.message || 'Failed to update record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entity, toast]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      const result = await api.delete(`/api/crud/${entity}/${id}`);
      toast.success(result.message || 'Record deleted successfully');
      return result;
    } catch (err) {
      toast.error(err.message || 'Failed to delete record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entity, toast]);

  return { create, update, remove, loading };
}
