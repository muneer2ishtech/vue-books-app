<template>
  <div v-if="loaded" class="bg-panel border border-app rounded p-4">
    <h1 class="text-xl font-semibold mb-3">Edit Book</h1>
    <form class="grid md:grid-cols-2 gap-3" @submit.prevent="onSubmit">
      <input :value="form.id" disabled class="rounded border-app bg-white/5" />
      <label class="flex items-center gap-2"><input v-model="form.isActive" type="checkbox" /> isActive</label>
      <input v-model="form.title" maxlength="100" placeholder="Title" class="rounded border-app bg-white/5" />
      <input v-model="form.author" maxlength="100" placeholder="Author" class="rounded border-app bg-white/5" />
      <input v-model.number="form.year" type="number" placeholder="Year" class="rounded border-app bg-white/5" />
      <input v-model="priceText" placeholder="Price (2 decimals)" class="rounded border-app bg-white/5" />
      <textarea v-model="form.description" maxlength="1000" placeholder="Description" class="rounded border-app bg-white/5 md:col-span-2" />
      <div class="md:col-span-2 space-x-2">
        <button class="bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50" :disabled="!canSubmit">{{ $t('submit') }}</button>
        <button type="button" class="border border-app rounded px-3 py-2" @click="reset">{{ $t('reset') }}</button>
        <button type="button" class="border border-app rounded px-3 py-2" @click="cancel">{{ $t('cancel') }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getBook, updateBook } from '@/api/books';
import { useAlertsStore } from '@/stores/alerts';
import { getApiErrorMessage } from '@/utils/error';

const route = useRoute();
const router = useRouter();
const alerts = useAlertsStore();
const loaded = ref(false);
const yearNow = new Date().getFullYear();
const form = reactive({
  id: 0,
  title: '',
  author: '',
  year: yearNow,
  price: 0,
  isActive: true,
  description: ''
});
const original = ref('');
const priceText = ref('0.00');

async function load() {
  const res = await getBook(String(route.params.id));
  Object.assign(form, res.data);
  priceText.value = Number(form.price).toFixed(2);
  original.value = JSON.stringify({ ...form, price: Number(priceText.value) });
  loaded.value = true;
}
load();

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
  () => JSON.stringify({ ...form, price: Number(priceText.value) }) !== original.value
);
const canSubmit = computed(() => Boolean(valid.value && dirty.value));

function reset() {
  Object.assign(form, JSON.parse(original.value));
  priceText.value = Number(form.price).toFixed(2);
}
function cancel() {
  reset();
  router.push(`/books/${route.params.id}`);
}
async function onSubmit() {
  if (!canSubmit.value) return;
  try {
    await updateBook(String(route.params.id), {
      title: form.title.trim(),
      author: form.author.trim(),
      year: form.year,
      price: Number(priceText.value),
      isActive: form.isActive,
      description: form.description.trim()
    });
    alerts.push('success', 'Book updated successfully');
    await router.replace(`/books/${route.params.id}`);
  } catch (error) {
    alerts.push('error', getApiErrorMessage(error));
  }
}
</script>
