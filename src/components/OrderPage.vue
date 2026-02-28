<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Commander</h1>

    <div v-for="(item, idx) in items" :key="idx" class="flex justify-between py-2 border-b">
      <div>{{ item.name }} x{{ item.quantity }}</div>
      <div>{{ (item.unitPrice * item.quantity).toFixed(2) }} {{ currency }}</div>
    </div>

    <div class="mt-4">
      <input v-model="promoCode" placeholder="Code promo" class="border p-2 w-full" />
      <button @click="applyPromo" class="bg-green-600 text-white px-4 py-2 mt-2">Appliquer</button>
    </div>

    <div class="mt-4 font-bold">
      Total: {{ total.toFixed(2) }} {{ currency }}<br />
      Réduction: {{ discount.toFixed(2) }} {{ currency }}<br />
      Final: {{ final.toFixed(2) }} {{ currency }}
    </div>

    <button @click="checkout" class="bg-blue-600 text-white px-6 py-3 mt-6 rounded-lg w-full">Payer avec Molam</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import axios from "axios";

const items = ref<any[]>([]);
const promoCode = ref("");
const discountPercent = ref(0);
const currency = "XOF";

const total = computed(() => items.value.reduce((a, it) => a + it.unitPrice * it.quantity, 0));
const discount = computed(() => total.value * (discountPercent.value / 100));
const final = computed(() => total.value - discount.value);

async function applyPromo() {
  const res = await axios.post("/api/orders", { items: items.value, promoCode: promoCode.value });
  discountPercent.value = res.data.discount_amount > 0 ? (res.data.discount_amount / total.value) * 100 : 0;
}

async function checkout() {
  await axios.post("/api/orders", { items: items.value, promoCode: promoCode.value });
  alert("Commande validée !");
}
</script>
