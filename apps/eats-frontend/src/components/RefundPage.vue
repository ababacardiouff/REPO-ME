<template>
  <div class="refund-page">
    <h1>Demander un remboursement</h1>
    <form @submit.prevent="submitRefund">
      <input v-model="orderId" placeholder="ID commande" required />
      <input v-model="amount" type="number" placeholder="Montant" required />
      <input v-model="currency" placeholder="Devise (XOF, EUR, USD...)" required />
      <select v-model="language">
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
      <textarea v-model="reason" placeholder="Motif" required></textarea>
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit">Envoyer</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const orderId = ref("");
const amount = ref("");
const currency = ref("XOF");
const language = ref("fr");
const reason = ref("");
const email = ref("");

async function submitRefund() {
  await axios.post("/api/refunds", {
    orderId: orderId.value,
    amount: Number(amount.value),
    currency: currency.value,
    language: language.value,
    reason: reason.value,
    email: email.value,
    userId: "currentUser",
    molamId: "current-molam-id",
  });

  alert("Remboursement soumis");
}
</script>
