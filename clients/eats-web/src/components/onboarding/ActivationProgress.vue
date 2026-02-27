<template>
  <div class="border rounded p-3">
    <p class="font-medium">Status: {{ status }}</p>
    <p v-if="missing && missing.length" class="text-sm text-orange-600">
      Missing docs: {{ missing.join(", ") }}
    </p>
    <p v-else-if="status === 'VERIFIED'" class="text-sm text-green-600">Account activated.</p>
  </div>
</template>

<script setup>
defineProps({
  status: { type: String, required: true },
  missing: { type: Array, default: () => [] }
});
</script>
