<template>
  <div class="p-6">
    <h2 class="mb-4 text-2xl font-bold">Vendor Profiles (Molam Eats)</h2>
    <button class="btn btn-primary mb-4" @click="openModal">+ Add Profile</button>

    <table class="table-auto w-full border">
      <thead>
        <tr>
          <th class="px-4 py-2">User</th>
          <th class="px-4 py-2">Role</th>
          <th class="px-4 py-2">Status</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="profile in profiles" :key="profile.id">
          <td>{{ profile.molamUserId }}</td>
          <td>{{ profile.role }}</td>
          <td>{{ profile.active ? "Active" : "Disabled" }}</td>
          <td>
            <button class="btn btn-danger" @click="removeProfile(profile.id)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ProfileModal v-if="showModal" @close="closeModal" @save="createProfile" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ProfileModal from "@/components/vendor/ProfileModal.vue";
import api from "@/services/api";

type VendorProfile = {
  id: string;
  molamUserId: string;
  role: string;
  active: boolean;
};

const profiles = ref<VendorProfile[]>([]);
const showModal = ref(false);
const vendorId = "123e4567-e89b-12d3-a456-426614174111";

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function fetchProfiles() {
  const { data } = await api.get(`/eats/vendor-profiles/${vendorId}`);
  profiles.value = data;
}

async function createProfile(data: { molamUserId: string; role: string }) {
  await api.post("/eats/vendor-profiles", { ...data, vendorId });
  await fetchProfiles();
  closeModal();
}

async function removeProfile(id: string) {
  await api.delete(`/eats/vendor-profiles/${id}`);
  await fetchProfiles();
}

onMounted(fetchProfiles);
</script>
