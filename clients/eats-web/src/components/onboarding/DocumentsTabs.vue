<template>
  <div>
    <ul class="flex gap-2 mb-2">
      <li v-for="t in tabs" :key="t">
        <button class="border rounded px-2 py-1" @click="active = t">{{ t }}</button>
      </li>
    </ul>
    <FileUpload :docType="active" :vendorId="vendorId" @uploaded="uploaded" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import FileUpload from "./FileUpload.vue";

defineProps({ vendorId: { type: String, required: true } });
const emit = defineEmits(["uploaded"]);

const tabs = ["identity", "license", "bank", "extra"];
const active = ref("identity");

function uploaded(payload) {
  emit("uploaded", payload);
}
</script>
