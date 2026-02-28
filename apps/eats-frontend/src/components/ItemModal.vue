<template>
  <div class="modal">
    <form @submit.prevent="save">
      <input v-model="form.name.fr" placeholder="Name (FR)" />
      <input v-model.number="form.price" type="number" step="0.01" />
      <input type="file" @change="onFile" />
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';

const emit = defineEmits(['saved']);
const props = defineProps({ item: { type: Object, default: null } });
const form = reactive(props.item ? { ...props.item } : { name: { fr: '', en: '' }, price: 0, images: [] });

async function onFile(e) {
  const file = e.target?.files?.[0];
  if (!file) return;

  const fd = new FormData();
  fd.append('file', file);
  const res = await axios.post('/api/uploads', fd);
  form.images.push({ url: res.data.url });
}

async function save() {
  if (form.id) {
    await axios.put(`/api/catalog/items/${form.id}`, form);
  } else {
    await axios.post(`/api/catalog/restaurants/${form.restaurantId}/items`, form);
  }
  emit('saved');
}
</script>
