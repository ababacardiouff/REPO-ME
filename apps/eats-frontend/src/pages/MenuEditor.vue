<template>
  <div class="menu-editor">
    <h1>{{ $t('menu.editor.title') }}</h1>
    <RestaurantSelector v-model="restaurantId" />
    <CategoryList :restaurant-id="restaurantId" @create="reload" />
    <ItemList :restaurant-id="restaurantId" @create="reload" />
    <ItemModal v-if="editingItem" :item="editingItem" @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ItemList from '../components/ItemList.vue';
import CategoryList from '../components/CategoryList.vue';
import RestaurantSelector from '../components/RestaurantSelector.vue';
import ItemModal from '../components/ItemModal.vue';

const restaurantId = ref(null);
const editingItem = ref(null);

function reload() {}
function onSaved() {
  editingItem.value = null;
  reload();
}
</script>
