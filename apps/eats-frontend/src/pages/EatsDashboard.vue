<template>
  <div class="dashboard">
    <h2>{{ $t('eats.dashboard.title') }}</h2>
    <div>
      <p>{{ user.displayName }} — {{ user.country }} / {{ user.currency }}</p>
    </div>
    <router-link to="/eats/profile">{{ $t('eats.dashboard.profile') }}</router-link>
    <router-link to="/eats/orders">{{ $t('eats.dashboard.orders') }}</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const user = ref({});

onMounted(async () => {
  const res = await axios.get("/accounts/me");
  user.value = res.data;
});
</script>
