import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { listBooksMock, deleteBookMock, pushAlertMock } = vi.hoisted(() => ({
  listBooksMock: vi.fn(),
  deleteBookMock: vi.fn(),
  pushAlertMock: vi.fn()
}));

vi.mock('@/api/books', () => ({
  listBooks: listBooksMock,
  deleteBook: deleteBookMock
}));

vi.mock('@/stores/alerts', () => ({
  useAlertsStore: () => ({
    push: pushAlertMock
  })
}));

import BooksListView from '@/views/books/BooksListView.vue';

describe('BooksListView mock tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    listBooksMock.mockResolvedValue({
      data: {
        content: [
          { id: 1, title: 'Book One', author: 'Author A', year: 2020, price: 10.5, isActive: true },
          { id: 2, title: 'Book Two', author: 'Author B', year: 2021, price: 13.99, isActive: false }
        ],
        totalPages: 2
      }
    });
    deleteBookMock.mockResolvedValue({ status: 204 });
  });

  it('loads books, filters by title, and deletes a book', async () => {
    const wrapper = mount(BooksListView, {
      global: {
        mocks: { $t: (v: string) => v },
        stubs: { RouterLink: true, AppIcon: true }
      }
    });

    await flushPromises();
    expect(listBooksMock).toHaveBeenCalledWith({ page: 0, size: 10 });
    expect(wrapper.text()).toContain('Book One');

    const titleInput = wrapper.find('input[placeholder="Title"]');
    await titleInput.setValue('Book');
    vi.advanceTimersByTime(300);
    await flushPromises();
    expect(listBooksMock).toHaveBeenLastCalledWith({ page: 0, size: 10, title: 'Book' });

    await wrapper.find('button[aria-label="Delete book"]').trigger('click');
    expect(wrapper.text()).toContain('Delete Book');

    const confirmButton = wrapper.findAll('button').find((b) => b.text() === 'Confirm');
    expect(confirmButton).toBeTruthy();
    await confirmButton!.trigger('click');
    await flushPromises();

    expect(deleteBookMock).toHaveBeenCalledWith(1);
    expect(pushAlertMock).toHaveBeenCalledWith('success', 'Book deleted successfully');
  });
});
