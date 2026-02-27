<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Register your restaurant</h1>
    <form @submit.prevent="register" class="space-y-3">
      <div>
        <label class="block text-sm">Business name (FR)</label>
        <input v-model="form.business_name.fr" class="border rounded px-2 py-1 w-full" />
      </div>

      <div>
        <label class="block text-sm">Primary category</label>
        <select v-model="form.primary_category" class="border rounded px-2 py-1 w-full">
          <option>FastFood</option>
          <option>Restaurant</option>
          <option>Bakery</option>
        </select>
      </div>

      <button type="submit" class="bg-black text-white px-3 py-2 rounded">Create</button>
    </form>

    <DocumentsTabs v-if="vendorId" :vendorId="vendorId" @uploaded="onDocUploaded" class="mt-6" />
    <ActivationProgress :status="status" :missing="missing" class="mt-4" />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import ActivationProgress from "@/components/onboarding/ActivationProgress.vue";
import DocumentsTabs from "@/components/onboarding/DocumentsTabs.vue";

const form = reactive({
  vendor_type: "restaurant",
  business_name: { fr: "", en: "" },
  primary_category: ""
});

const vendorId = ref("");
const status = ref("idle");
const missing = ref([]);

async function register() {
  const res = await fetch("/api/eats/onboarding/register", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer dev" },
    body: JSON.stringify(form)
  });
  const data = await res.json();
  vendorId.value = data.id;
  status.value = data.status || "PENDING";
}

function onDocUploaded(payload) {
  missing.value = payload?.missing || [];
}
</script>
