import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getBookMock, updateBookMock, pushAlertMock, replaceMock, pushMock } = vi.hoisted(() => ({
  getBookMock: vi.fn(),
  updateBookMock: vi.fn(),
  pushAlertMock: vi.fn(),
  replaceMock: vi.fn(),
  pushMock: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '22' }
  }),
  useRouter: () => ({
    replace: replaceMock,
    push: pushMock
  })
}));

vi.mock('@/api/books', () => ({
  getBook: getBookMock,
  updateBook: updateBookMock
}));

vi.mock('@/stores/alerts', () => ({
  useAlertsStore: () => ({
    push: pushAlertMock
  })
}));

import BookEditView from '@/views/books/BookEditView.vue';

describe('BookEditView mock tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getBookMock.mockResolvedValue({
      data: {
        id: 22,
        title: 'Old Title',
        author: 'Old Author',
        year: 2020,
        price: 10,
        isActive: true,
        description: 'old'
      }
    });
    updateBookMock.mockResolvedValue({ status: 200 });
  });

  it('loads a book and updates it', async () => {
    const wrapper = mount(BookEditView, {
      global: { mocks: { $t: (v: string) => v } }
    });

    await flushPromises();
    expect(getBookMock).toHaveBeenCalledWith('22');

    const titleInput = wrapper.find('input[placeholder="Title"]');
    await titleInput.setValue('Updated Title');
    await wrapper.find('input[placeholder="Price (2 decimals)"]').setValue('15.75');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(updateBookMock).toHaveBeenCalledWith('22', {
      title: 'Updated Title',
      author: 'Old Author',
      year: 2020,
      price: 15.75,
      isActive: true,
      description: 'old'
    });
    expect(pushAlertMock).toHaveBeenCalledWith('success', 'Book updated successfully');
    expect(replaceMock).toHaveBeenCalledWith('/books/22');
  });
});
