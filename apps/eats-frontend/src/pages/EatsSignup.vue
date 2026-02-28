<template>
  <div class="eats-signup">
    <h1>{{ $t('eats.signup.title') }}</h1>
    <p>{{ $t('eats.signup.subtitle') }}</p>
    <button @click="activate" :disabled="loading">
      {{ loading ? $t('eats.signup.loading') : $t('eats.signup.button') }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const loading = ref(false);
const router = useRouter();

async function activate() {
  loading.value = true;
  try {
    await axios.post("/accounts/activate");
    router.push("/eats/dashboard");
  } finally {
    loading.value = false;
  }
}
</script>
