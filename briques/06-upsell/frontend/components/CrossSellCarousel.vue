<template>
  <div class="cross-sell mt-3">
    <h5 class="text-sm font-semibold mb-2">You might also like</h5>
    <div class="flex overflow-x-auto gap-3">
      <div v-for="i in items" :key="i.id" class="card w-40 p-2 bg-white rounded">
        <img :src="i.image || '/img/placeholder.png'" class="w-full h-24 object-cover rounded" />
        <div class="text-sm mt-1">{{ i.title }}</div>
        <div class="text-xs text-muted">{{ i.currency }} {{ i.price }}</div>
        <button class="btn-xs mt-2" @click="$emit('add', i)">Add</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: any[] }>();
defineEmits<["add"]>();
</script>
