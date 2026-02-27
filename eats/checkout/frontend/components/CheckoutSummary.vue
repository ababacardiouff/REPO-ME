<template>
  <div class="checkout-summary">
    <h3>Order Summary</h3>
    <ul>
      <li v-for="item in items" :key="item.name">{{ item.name }} x{{ item.qty }} — {{ item.price }}</li>
    </ul>
    <p>Total: {{ total }}</p>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  total: { type: Number, required: true }
});
</script>
