<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Books</h1>
      <RouterLink to="/books/new" class="bg-blue-600 text-white rounded px-3 py-2">{{ $t('new') }}</RouterLink>
    </div>

    <div class="bg-panel border border-app rounded p-3 space-y-3">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input v-model="filters.id" type="number" placeholder="ID" class="rounded border-app bg-white/5" />
        <input v-model="filters.title" placeholder="Title" class="rounded border-app bg-white/5" />
        <input v-model="filters.author" placeholder="Author" class="rounded border-app bg-white/5" />
        <select v-model="filters.isActive" class="rounded border-app bg-white/5">
          <option value="">Active</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b border-app">
              <th class="text-left py-2">Title</th>
              <th class="text-left py-2">Author</th>
              <th class="text-left py-2">Year</th>
              <th class="text-left py-2">Price</th>
              <th class="text-left py-2">Active</th>
              <th class="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id" class="border-b border-app">
              <td class="py-2">{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.year }}</td>
              <td>{{ book.price.toFixed(2) }}</td>
              <td>{{ book.isActive ? '✔' : '✖' }}</td>
              <td class="space-x-2">
                <RouterLink :to="`/books/${book.id}`" class="inline-flex" aria-label="View book">
                  <AppIcon :icon="Eye" />
                </RouterLink>
                <button @click="askDelete(book.id)" class="inline-flex" aria-label="Delete book">
                  <AppIcon :icon="Trash2" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden space-y-2">
        <div v-for="book in books" :key="book.id" class="border border-app rounded p-2">
          <div class="font-semibold">{{ book.title }}</div>
          <div class="text-sm text-muted">{{ book.author }} - {{ book.year }}</div>
          <div class="text-sm">{{ book.price.toFixed(2) }} / {{ book.isActive ? '✔' : '✖' }}</div>
          <div class="mt-1 space-x-2">
            <RouterLink :to="`/books/${book.id}`">View</RouterLink>
            <button @click="askDelete(book.id)">Delete</button>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <select v-model.number="size" @change="loadBooks" class="rounded border-app bg-white/5">
          <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option><option :value="100">100</option><option :value="10000">{{ $t('showAll') }}</option>
        </select>
        <button class="border border-app rounded px-2" :disabled="page === 0" @click="prev">{{ $t('previous') }}</button>
        <button class="border border-app rounded px-2" :disabled="page + 1 >= totalPages" @click="next">{{ $t('next') }}</button>
        <span>{{ $t('pageLabel') }} {{ page + 1 }} {{ $t('ofLabel') }} {{ Math.max(totalPages, 1) }}</span>
        <button class="border border-app rounded px-2" @click="resetFilters">{{ $t('reset') }}</button>
      </div>
    </div>

    <ConfirmDialog :open="confirmOpen" title="Delete Book" message="Are you sure?" @cancel="confirmOpen = false" @confirm="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { Eye, Trash2 } from 'lucide-vue-next';

import { deleteBook, listBooks } from '@/api/books';
import AppIcon from '@/components/common/AppIcon.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useAlertsStore } from '@/stores/alerts';
import type { Book } from '@/types';
import { getApiErrorMessage } from '@/utils/error';

const books = ref<Book[]>([]);
const alerts = useAlertsStore();
const page = ref(0);
const size = ref(10);
const totalPages = ref(0);
const filters = reactive({ id: '', title: '', author: '', isActive: '' });
const confirmOpen = ref(false);
const pendingDeleteId = ref<number | null>(null);

async function loadBooks() {
  const params: Record<string, unknown> = { page: page.value, size: size.value };
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== '') params[k] = v;
  });
  const response = await listBooks(params);
  books.value = response.data.content;
  totalPages.value = response.data.totalPages;
}

let timeoutId = 0;
watch(filters, () => {
  clearTimeout(timeoutId);
  timeoutId = window.setTimeout(() => {
    page.value = 0;
    loadBooks();
  }, 250);
}, { deep: true });

loadBooks();

function prev() {
  if (page.value <= 0) return;
  page.value -= 1;
  loadBooks();
}
function next() {
  if (page.value + 1 >= totalPages.value) return;
  page.value += 1;
  loadBooks();
}
function resetFilters() {
  filters.id = '';
  filters.title = '';
  filters.author = '';
  filters.isActive = '';
  page.value = 0;
  size.value = 10;
  loadBooks();
}
function askDelete(id: number) {
  pendingDeleteId.value = id;
  confirmOpen.value = true;
}
async function confirmDelete() {
  if (!pendingDeleteId.value) return;
  try {
    const response = await deleteBook(pendingDeleteId.value);
    if ([200, 204, 410].includes(response.status)) {
      alerts.push('success', 'Book deleted successfully');
      confirmOpen.value = false;
      await loadBooks();
    }
  } catch (error: any) {
    if (error?.response?.status === 410) {
      alerts.push('success', 'Book deleted successfully');
      confirmOpen.value = false;
      await loadBooks();
      return;
    }
    alerts.push('error', getApiErrorMessage(error));
  }
}
</script>
