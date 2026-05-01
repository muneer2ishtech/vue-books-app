<template>
  <div class="flex items-center gap-3 mr-2 shrink-0">
    <FooterExternalLinkItem
      href="https://www.ishtech.fi/"
      src="/assets/images/logo/ishtech_iat_logo_155.png"
      alt="ishtech"
      tooltip="IshTech"
      variant="logo"
    />
    <FooterExternalLinkItem
      href="https://www.linkedin.com/in/muneerahmedsyed/"
      src="/assets/images/avatars/Muneer_2005.jpeg"
      alt="Muneer"
      tooltip="Muneer"
      variant="avatar"
    />
  </div>
</template>

<script setup lang="ts">
import FooterExternalLinkItem from '@/components/layout/FooterExternalLinkItem.vue';
</script>
