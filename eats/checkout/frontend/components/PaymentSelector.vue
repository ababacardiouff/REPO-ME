<template>
  <label>
    <span>Payment Method</span>
    <select id="payment-method" :value="modelValue" @change="onChange">
      <option value="molamPay">Molam Pay</option>
      <option value="stripe">Stripe</option>
      <option value="wave">Wave Mobile Money</option>
    </select>
  </label>
</template>

<script setup>
defineProps({ modelValue: { type: String, required: true } });
const emit = defineEmits(["update:modelValue"]);

const onChange = (event) => emit("update:modelValue", event.target.value);
</script>
