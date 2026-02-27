<template>
  <div>
    <h3>Create item</h3>
    <input v-model="form.name.fr" placeholder="Nom (FR)" />
    <input v-model="form.name.en" placeholder="Name (EN)" />
    <input v-model.number="form.price" placeholder="Price (cents)" />
    <button @click="create">Create</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({ name: { fr: '', en: '' }, price: 0 });

async function create() {
  await fetch('/api/eats/items', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      vendorId: '0000',
      skuCode: `SKU-${Date.now()}`,
      name: form.value.name,
      defaultPriceCents: form.value.price,
      currency: 'XOF'
    })
  });

  alert('created');
}
</script>
