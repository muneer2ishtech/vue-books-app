import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getBookMock, deleteBookMock, pushAlertMock, replaceMock } = vi.hoisted(() => ({
  getBookMock: vi.fn(),
  deleteBookMock: vi.fn(),
  pushAlertMock: vi.fn(),
  replaceMock: vi.fn()
}));

vi.mock('vue-router', () => ({
  RouterLink: {
    template: '<a><slot /></a>'
  },
  useRoute: () => ({
    params: { id: '12' }
  }),
  useRouter: () => ({
    replace: replaceMock
  })
}));

vi.mock('@/api/books', () => ({
  getBook: getBookMock,
  deleteBook: deleteBookMock
}));

vi.mock('@/stores/alerts', () => ({
  useAlertsStore: () => ({
    push: pushAlertMock
  })
}));

import BookDetailsView from '@/views/books/BookDetailsView.vue';

describe('BookDetailsView mock tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getBookMock.mockResolvedValue({
      data: {
        id: 12,
        title: 'Deep Work',
        author: 'Cal Newport',
        year: 2016,
        price: 19.99,
        isActive: true,
        description: 'Focus'
      }
    });
    deleteBookMock.mockResolvedValue({ status: 204 });
  });

  it('loads and shows a book, then deletes and redirects', async () => {
    const wrapper = mount(BookDetailsView, {
      global: { mocks: { $t: (v: string) => v } }
    });

    await flushPromises();
    expect(getBookMock).toHaveBeenCalledWith('12');
    expect(wrapper.text()).toContain('Deep Work');

    await wrapper.find('button.bg-red-600').trigger('click');
    const confirmButton = wrapper.findAll('button').find((b) => b.text() === 'Confirm');
    expect(confirmButton).toBeTruthy();
    await confirmButton!.trigger('click');
    await flushPromises();

    expect(deleteBookMock).toHaveBeenCalledWith('12');
    expect(pushAlertMock).toHaveBeenCalledWith('success', 'Book deleted successfully');
    expect(replaceMock).toHaveBeenCalledWith('/books');
  });
});
