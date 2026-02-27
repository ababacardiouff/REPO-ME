<template>
  <div v-if="data" class="upsell-panel p-4 bg-white rounded-lg shadow">
    <h4 class="text-lg font-semibold">Upgrade your meal</h4>

    <div v-if="data.premium.length" class="mt-3">
      <div v-for="p in data.premium" :key="p.id" class="flex items-center justify-between py-2 border-b">
        <div>
          <div class="font-medium">{{ p.title }}</div>
          <div class="text-sm text-muted">{{ p.currency }} {{ p.price }}</div>
        </div>
        <button class="btn-sm" @click="addToCart(p)">Choose</button>
      </div>
    </div>

    <CrossSellCarousel v-if="data.cross && data.cross.length" :items="data.cross" />
    <ChefFatimaMenu v-if="data.FatimaBundle && data.FatimaBundle.items" :bundle="data.FatimaBundle" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import CrossSellCarousel from "./CrossSellCarousel.vue";
import ChefFatimaMenu from "./ChefFatimaMenu.vue";
import api from "@/services/api";

const props = defineProps<{ productId: string }>();
const data = ref<any>(null);

onMounted(async () => {
  const response = await api.get(`/api/upsell/${props.productId}`);
  data.value = response.data?.data ?? response.data;
});

function addToCart(product: any) {
  void api.post("/api/cart/add", { productId: product.id, qty: 1 });
}
</script>

<style scoped>
.upsell-panel {
  max-width: 720px;
}
</style>
