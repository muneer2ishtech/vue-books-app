<template>
  <div v-if="book" class="bg-panel border border-app rounded p-4 space-y-2">
    <h1 class="text-xl font-semibold">Book #{{ book.id }}</h1>
    <p><strong>Title:</strong> {{ book.title }}</p>
    <p><strong>Author:</strong> {{ book.author }}</p>
    <p><strong>Year:</strong> {{ book.year }}</p>
    <p><strong>Price:</strong> {{ book.price }}</p>
    <p><strong>Active:</strong> {{ book.isActive ? 'Yes' : 'No' }}</p>
    <p><strong>Description:</strong> {{ book.description || '-' }}</p>
    <div class="space-x-2">
      <RouterLink :to="`/books/${book.id}/edit`" class="bg-blue-600 text-white rounded px-3 py-2">{{ $t('edit') }}</RouterLink>
      <button class="bg-red-600 text-white rounded px-3 py-2" @click="open = true">Delete</button>
    </div>
  </div>
  <ConfirmDialog :open="open" title="Delete Book" message="Are you sure?" @cancel="open = false" @confirm="onDelete" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import { deleteBook, getBook } from '@/api/books';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useAlertsStore } from '@/stores/alerts';
import type { Book } from '@/types';
import { getApiErrorMessage } from '@/utils/error';

const route = useRoute();
const router = useRouter();
const alerts = useAlertsStore();
const open = ref(false);
const book = ref<Book | null>(null);

async function load() {
  const res = await getBook(String(route.params.id));
  book.value = res.data;
}
load();

async function onDelete() {
  try {
    const res = await deleteBook(String(route.params.id));
    if ([200, 204, 410].includes(res.status)) {
      alerts.push('success', 'Book deleted successfully');
      await router.replace('/books');
    }
  } catch (error: any) {
    if (error?.response?.status === 410) {
      alerts.push('success', 'Book deleted successfully');
      await router.replace('/books');
      return;
    }
    alerts.push('error', getApiErrorMessage(error));
  }
}
</script>
