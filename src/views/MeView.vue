<template>
  <div class="bg-panel border border-app rounded p-4 space-y-2">
    <h1 class="text-xl font-semibold">My Profile</h1>
    <p><strong>Email:</strong> {{ auth.payload?.sub || '-' }}</p>
    <p><strong>User ID:</strong> {{ auth.payload?.userId ?? '-' }}</p>
    <p><strong>Full Name:</strong> {{ auth.payload?.fullName?.trim() || '-' }}</p>
    <p><strong>Language:</strong> {{ auth.payload?.lang?.trim() || '-' }}</p>
    <p><strong>Roles:</strong> {{ auth.roles.length ? auth.roles.join(', ') : '-' }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
</script>
