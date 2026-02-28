<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="w-1/3 rounded-lg bg-white p-6 shadow-lg">
      <h3 class="mb-4 text-xl font-semibold">Add Profile</h3>
      <form @submit.prevent="save">
        <label class="mb-2 block">Molam User ID</label>
        <input v-model="molamUserId" class="input mb-4 w-full" required />

        <label class="mb-2 block">Role</label>
        <select v-model="role" class="input mb-4 w-full" required>
          <option disabled value="">Select role</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Marketer</option>
          <option>Accountant</option>
          <option>ExternalAgent</option>
        </select>

        <div class="flex justify-end gap-2">
          <button type="button" class="btn btn-secondary" @click="emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  close: [];
  save: [payload: { molamUserId: string; role: string }];
}>();

const molamUserId = ref("");
const role = ref("");

function save() {
  if (!molamUserId.value || !role.value) {
    return;
  }

  emit("save", { molamUserId: molamUserId.value, role: role.value });
}
</script>
