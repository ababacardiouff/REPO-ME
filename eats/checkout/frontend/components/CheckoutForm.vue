<template>
  <div class="checkout-form">
    <CheckoutSummary :items="items" :total="total" />
    <PaymentSelector v-model="paymentMethod" />
    <button id="confirm-pay" @click="submitCheckout">Confirm & Pay</button>
    <button id="express-pay" @click="submitExpress">1-Click Pay</button>
    <p v-if="success" class="checkout-success">Payment Successful</p>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import CheckoutSummary from "./CheckoutSummary.vue";
import PaymentSelector from "./PaymentSelector.vue";
import api from "../services/api";

const items = ref([
  { name: "Pizza", price: 10, qty: 2 },
  { name: "Drink", price: 5, qty: 1 }
]);
const paymentMethod = ref("molamPay");
const success = ref(false);

const total = computed(() => items.value.reduce((acc, item) => acc + item.price * item.qty, 0));

const submitCheckout = async () => {
  await api.post("/checkout", {
    items: items.value,
    paymentMethod: paymentMethod.value,
    userId: "USER123",
    country: "SN"
  });
  success.value = true;
};

const submitExpress = async () => {
  await api.post("/checkout/express", {
    items: items.value,
    userId: "USER123",
    country: "SN"
  });
  success.value = true;
};
</script>
