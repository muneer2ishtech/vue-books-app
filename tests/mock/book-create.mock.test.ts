import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createBookMock, pushAlertMock, replaceMock, pushMock } = vi.hoisted(() => ({
  createBookMock: vi.fn(),
  pushAlertMock: vi.fn(),
  replaceMock: vi.fn(),
  pushMock: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: pushMock
  })
}));

vi.mock('@/api/books', () => ({
  createBook: createBookMock
}));

vi.mock('@/stores/alerts', () => ({
  useAlertsStore: () => ({
    push: pushAlertMock
  })
}));

import BookCreateView from '@/views/books/BookCreateView.vue';

describe('BookCreateView mock tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createBookMock.mockResolvedValue({ headers: { location: '/api/v1/books/55' } });
  });

  it('creates a book and navigates to created details page', async () => {
    const wrapper = mount(BookCreateView, {
      global: { mocks: { $t: (v: string) => v } }
    });

    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('New Title');
    await inputs[1].setValue('Some Author');
    await inputs[2].setValue('2021');
    await inputs[3].setValue('12.50');
    await wrapper.find('textarea').setValue('desc');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(createBookMock).toHaveBeenCalledWith({
      title: 'New Title',
      author: 'Some Author',
      year: 2021,
      price: 12.5,
      description: 'desc'
    });
    expect(pushAlertMock).toHaveBeenCalledWith('success', 'Book created successfully');
    expect(replaceMock).toHaveBeenCalledWith('/books/55');
  });
});
