<template>
  <div class="space-y-2">
    <input type="file" @change="onPick" />
    <button class="bg-blue-600 text-white px-3 py-1 rounded" :disabled="!file || loading" @click="upload">
      {{ loading ? "Uploading..." : `Upload ${docType}` }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  docType: { type: String, required: true },
  vendorId: { type: String, required: true }
});
const emit = defineEmits(["uploaded"]);

const file = ref(null);
const loading = ref(false);

function onPick(e) {
  file.value = e.target.files?.[0] || null;
}

async function upload() {
  if (!file.value) return;
  loading.value = true;

  const data = new FormData();
  data.append("file", file.value);
  data.append("doc_type", props.docType);

  await fetch(`/api/eats/documents/${props.vendorId}/upload`, {
    method: "POST",
    headers: { authorization: "Bearer dev" },
    body: data
  });

  const activation = await fetch(`/api/eats/onboarding/${props.vendorId}/activate`, {
    method: "POST",
    headers: { authorization: "Bearer dev" }
  });

  const result = await activation.json();
  emit("uploaded", result);
  loading.value = false;
}
</script>
