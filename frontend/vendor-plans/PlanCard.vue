<template>
  <div class="plan-card">
    <h3>{{ name }}</h3>
    <p v-if="plan.price_cents > 0" class="price">{{ formattedPrice }} / month</p>
    <p v-else>Free</p>
    <p v-if="plan.article_quota !== null">{{ plan.article_quota }} articles / month</p>
    <p v-else>Articles illimités</p>
    <button @click="selectPlan">Activate</button>
    <p v-if="remaining !== undefined">Remaining this month: {{ remaining === null ? '∞' : remaining }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  plan: { type: Object, required: true },
  currentLang: { type: String, default: 'fr' },
  onActivate: { type: Function, default: () => {} },
  remaining: { type: Number, default: undefined }
});

const name = computed(() => props.plan.name[props.currentLang] || props.plan.name.en);
const formattedPrice = computed(() => (props.plan.price_cents / 100).toLocaleString(undefined, { style: 'currency', currency: props.plan.currency }));

function selectPlan() {
  props.onActivate(props.plan.code);
}
</script>

<style scoped>
.plan-card { border: 1px solid #eee; padding: 16px; border-radius: 12px; width: 220px; }
.price { font-size: 1.25rem; font-weight: 600; }
button { margin-top: 12px; padding: 8px 12px; border-radius: 8px; }
</style>
