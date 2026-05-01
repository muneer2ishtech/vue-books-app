<template>
  <AuthShell>
    <form class="w-full max-w-md bg-panel border border-app rounded p-5 space-y-3" @submit.prevent="onSubmit">
      <h1 class="text-xl font-semibold">{{ $t('signup') }}</h1>
      <input v-model.trim="form.firstName" :placeholder="$t('firstName')" class="w-full rounded border-app bg-white/5" />
      <input v-model.trim="form.lastName" :placeholder="$t('lastName')" class="w-full rounded border-app bg-white/5" />
      <input v-model.trim="form.email" type="email" :placeholder="$t('email')" class="w-full rounded border-app bg-white/5" />
      <div class="flex gap-2">
        <input v-model="form.password" :type="show1 ? 'text' : 'password'" :placeholder="$t('password')" class="flex-1 rounded border-app bg-white/5" />
        <button type="button" class="border border-app rounded px-2 py-1" @click="show1 = !show1" :aria-label="show1 ? 'Mask password' : 'Unmask password'">
          <AppIcon v-if="!show1" :icon="Eye" />
          <AppIcon v-else :icon="EyeOff" />
        </button>
      </div>
      <div class="flex gap-2">
        <input v-model="form.passwordConfirm" :type="show2 ? 'text' : 'password'" :placeholder="$t('confirmPassword')" class="flex-1 rounded border-app bg-white/5" />
        <button type="button" class="border border-app rounded px-2 py-1" @click="show2 = !show2" :aria-label="show2 ? 'Mask password' : 'Unmask password'">
          <AppIcon v-if="!show2" :icon="Eye" />
          <AppIcon v-else :icon="EyeOff" />
        </button>
      </div>
      <label class="flex items-center gap-2"><input v-model="form.acceptTermsConditions" type="checkbox" /> {{ $t('acceptTerms') }}</label>
      <button class="w-full rounded bg-blue-600 text-white py-2">{{ $t('signup') }}</button>
      <RouterLink to="/signin" class="underline text-sm block">{{ $t('backToSignIn') }}</RouterLink>
    </form>
  </AuthShell>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AuthShell from '@/components/layout/AuthShell.vue';
import { signup } from '@/api/auth';
import { getApiErrorMessage } from '@/utils/error';
import { useAlertsStore } from '@/stores/alerts';
import { Eye, EyeOff } from 'lucide-vue-next';
import AppIcon from '@/components/common/AppIcon.vue';

const router = useRouter();
const { locale, t } = useI18n();
const alerts = useAlertsStore();
const show1 = ref(false);
const show2 = ref(false);
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: '',
  acceptTermsConditions: false
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s\t]{8,}$/;

async function onSubmit() {
  if (!form.firstName || !form.lastName || !form.email) return alerts.push('error', t('missingRequiredFields'));
  if (!passwordRegex.test(form.password)) return alerts.push('error', t('passwordRulesFailed'));
  if (form.password !== form.passwordConfirm) return alerts.push('error', t('passwordsMustMatch'));
  if (!form.acceptTermsConditions) return alerts.push('error', t('acceptTermsFirst'));
  try {
    await signup({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      lang: String(locale.value || 'en')
    });
    alerts.push('success', t('signupSuccess'));
    await router.replace('/signin');
  } catch (error) {
    alerts.push('error', getApiErrorMessage(error));
  }
}
</script>
