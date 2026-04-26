<template>
  <div class="bg-panel border border-app rounded p-4">
    <h1 class="text-xl font-semibold mb-3">Create Book</h1>
    <form class="grid md:grid-cols-2 gap-3" @submit.prevent="onSubmit">
      <input v-model="form.title" maxlength="100" placeholder="Title" class="rounded border-app bg-white/5" />
      <input v-model="form.author" maxlength="100" placeholder="Author" class="rounded border-app bg-white/5" />
      <input v-model.number="form.year" type="number" placeholder="Year" class="rounded border-app bg-white/5" />
      <input v-model="priceText" placeholder="Price (2 decimals)" class="rounded border-app bg-white/5" />
      <textarea v-model="form.description" maxlength="1000" placeholder="Description" class="rounded border-app bg-white/5 md:col-span-2" />
      <div class="md:col-span-2 space-x-2">
        <button class="bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50" :disabled="!canSubmit">Submit</button>
        <button type="button" class="border border-app rounded px-3 py-2" @click="reset">Reset</button>
        <button type="button" class="border border-app rounded px-3 py-2" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createBook } from '@/api/books';
import { getApiErrorMessage } from '@/utils/error';
import { useAlertsStore } from '@/stores/alerts';

const router = useRouter();
const alerts = useAlertsStore();
const yearNow = new Date().getFullYear();
const initial = { title: '', author: '', year: yearNow, description: '' };
const form = reactive({ ...initial });
const priceText = ref('');

const validPrice = computed(() => /^(\d+)(\.\d{1,2})?$/.test(priceText.value));
const valid = computed(
  () =>
    form.title.trim() &&
    form.author.trim() &&
    Number.isInteger(form.year) &&
    form.year >= 1900 &&
    form.year <= yearNow &&
    validPrice.value
);
const dirty = computed(
  () => JSON.stringify(form) !== JSON.stringify(initial) || priceText.value !== ''
);
const canSubmit = computed(() => Boolean(valid.value && dirty.value));

function reset() {
  Object.assign(form, initial);
  priceText.value = '';
}
function cancel() {
  reset();
  router.push('/books');
}
async function onSubmit() {
  if (!canSubmit.value) return;
  try {
    const res = await createBook({
      title: form.title.trim(),
      author: form.author.trim(),
      year: form.year,
      price: Number(priceText.value),
      description: form.description.trim()
    });
    alerts.push('success', 'Book created successfully');
    const location = res.headers.location as string | undefined;
    const id = location?.match(/\/(\d+)$/)?.[1];
    await router.replace(id ? `/books/${id}` : '/books');
  } catch (error) {
    alerts.push('error', getApiErrorMessage(error));
  }
}
</script>
