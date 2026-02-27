<template>
  <div>
    <h1>Choisir un plan vendeur</h1>
    <div class="grid">
      <PlanCard v-for="p in plans" :key="p.code" :plan="p" :onActivate="activatePlan" :remaining="quotaMap[p.code]" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PlanCard from './PlanCard.vue';

const plans = ref([]);
const quotaMap = ref({});

onMounted(async () => {
  const token = localStorage.getItem('molam_jwt');
  const res = await fetch('/api/eats/plans/plans', { headers: { Authorization: `Bearer ${token}` } });
  plans.value = await res.json();

  await fetch('/api/eats/plans/subscription', { headers: { Authorization: `Bearer ${token}` } });
});

async function activatePlan(code) {
  const token = localStorage.getItem('molam_jwt');
  const res = await fetch('/api/eats/plans/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ planCode: code })
  });

  if (res.status === 201) {
    alert('Plan activated');
  } else {
    const body = await res.json();
    alert('Error: ' + (body.error || 'unknown'));
  }
}
</script>

<style>
.grid { display: flex; gap: 16px; }
</style>
