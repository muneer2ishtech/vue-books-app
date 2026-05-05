import { describe, expect, it, vi } from 'vitest';

const { getMock, postMock, putMock, deleteMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  putMock: vi.fn(),
  deleteMock: vi.fn()
}));

vi.mock('@/api/http', () => ({
  http: {
    get: getMock,
    post: postMock,
    put: putMock,
    delete: deleteMock
  }
}));

import { createBook, deleteBook, getBook, listBooks, updateBook } from '@/api/books';

describe('books api client', () => {
  it('lists books with query params', () => {
    const params = { page: 0, size: 10, title: 'Clean Code' };
    listBooks(params);
    expect(getMock).toHaveBeenCalledWith('/api/v1/books', { params });
  });

  it('gets one book by id', () => {
    getBook(10);
    expect(getMock).toHaveBeenCalledWith('/api/v1/books/10');
  });

  it('creates a book', () => {
    const payload = { title: 'New Book' };
    createBook(payload);
    expect(postMock).toHaveBeenCalledWith('/api/v1/books', payload);
  });

  it('updates a book', () => {
    const payload = { title: 'Edited Book' };
    updateBook('21', payload);
    expect(putMock).toHaveBeenCalledWith('/api/v1/books/21', payload);
  });

  it('deletes a book', () => {
    deleteBook(7);
    expect(deleteMock).toHaveBeenCalledWith('/api/v1/books/7');
  });
});
