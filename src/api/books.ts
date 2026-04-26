import type { BookPageResponse } from '@/types';
import { http } from './http';

export const listBooks = (params: Record<string, unknown>) => http.get<BookPageResponse>('/api/v1/books', { params });
export const getBook = (id: string | number) => http.get(`/api/v1/books/${id}`);
export const createBook = (payload: unknown) => http.post('/api/v1/books', payload);
export const updateBook = (id: string | number, payload: unknown) => http.put(`/api/v1/books/${id}`, payload);
export const deleteBook = (id: string | number) => http.delete(`/api/v1/books/${id}`);
