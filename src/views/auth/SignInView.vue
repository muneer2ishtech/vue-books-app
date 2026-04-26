<template>
  <AuthShell>
    <form class="w-full max-w-md bg-panel border border-app rounded p-5 space-y-3" @submit.prevent="onSubmit">
      <h1 class="text-xl font-semibold">{{ $t('signin') }}</h1>
      <div>
        <label class="block mb-1">{{ $t('email') }}</label>
        <input v-model.trim="username" type="email" class="w-full rounded border-app bg-white/5" />
      </div>
      <div>
        <label class="block mb-1">{{ $t('password') }}</label>
        <div class="flex gap-2">
          <input v-model="password" :type="show ? 'text' : 'password'" class="flex-1 rounded border-app bg-white/5" />
          <button type="button" class="border border-app rounded px-2" @click="show = !show">👁</button>
        </div>
      </div>
      <button class="w-full rounded bg-blue-600 text-white py-2">{{ $t('signin') }}</button>
      <RouterLink to="/signup" class="underline text-sm block">{{ $t('createAccount') }}</RouterLink>
    </form>
  </AuthShell>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AuthShell from '@/components/layout/AuthShell.vue';
import { signin } from '@/api/auth';
import { useAuthStore } from '@/stores/auth';
import { getApiErrorMessage } from '@/utils/error';

const router = useRouter();
const auth = useAuthStore();
const { t } = useI18n();
const username = ref('');
const password = ref('');
const show = ref(false);

async function onSubmit() {
  if (!username.value || !password.value) return alert(t('allFieldsRequired'));
  try {
    const res = await signin({ username: username.value, password: password.value });
    auth.setToken(res.data.access_token);
    alert(t('signInSuccess'));
    await router.replace('/home');
  } catch (error) {
    alert(getApiErrorMessage(error));
  }
}
</script>
