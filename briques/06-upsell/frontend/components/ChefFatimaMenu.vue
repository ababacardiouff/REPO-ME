<template>
  <div class="chef-Fatima mt-3 p-3 bg-cream rounded-lg">
    <h5 class="font-bold">🤖 Chef FATIMA suggests</h5>
    <ul class="mt-2">
      <li v-for="it in bundle.items" :key="it.id" class="flex justify-between text-sm">
        <span>{{ it.name }}</span>
        <span>{{ it.currency }} {{ it.price }}</span>
      </li>
    </ul>
    <div class="mt-2 font-semibold">Total: {{ bundle.currency }} {{ bundle.total }}</div>
    <div class="mt-3 flex gap-2">
      <button class="btn-primary" @click="acceptBundle">Add menu</button>
      <button class="btn-ghost" @click="decline">Not now</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{ bundle: any }>();
const { bundle } = toRefs(props);

function acceptBundle() {
  void fetch(`/api/upsell/${bundle.value.baseProductId}/accept`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ bundleId: bundle.value.id, source: "CHEF_FATIMA" }),
  });
}

function decline() {
  // track metric if needed
}
</script>
