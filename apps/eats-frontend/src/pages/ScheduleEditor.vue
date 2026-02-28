<template>
  <div class="schedule-editor">
    <h2>{{ $t('schedule.title') }}</h2>

    <TimezonePicker v-model="form.timezone" />

    <div v-for="d in weekdays" :key="d.value" class="weekday-row">
      <h3>{{ d.label }}</h3>
      <div v-for="(r, idx) in form.weeklyRules.filter((w) => w.weekday === d.value)" :key="idx" class="rule">
        <time-input v-model="r.startTime" />
        <time-input v-model="r.endTime" />
        <button @click="removeRule(r.id)">Delete</button>
      </div>
      <button @click="addRule(d.value)">{{ $t('schedule.add_period') }}</button>
    </div>

    <h3>{{ $t('schedule.exceptions') }}</h3>
    <div v-for="ex in form.exceptions" :key="ex.id">
      <input v-model="ex.date" type="date" />
      <input v-model="ex.startTime" type="time" />
      <input v-model="ex.endTime" type="time" />
      <label><input v-model="ex.isOpen" type="checkbox" /> {{ $t('schedule.open') }}</label>
      <button @click="removeException(ex.id)">Remove</button>
    </div>
    <button @click="addException">{{ $t('schedule.add_exception') }}</button>

    <div class="controls">
      <label>{{ $t('schedule.lead_time') }} <input v-model.number="form.leadTimeMinutes" type="number" /></label>
      <label>{{ $t('schedule.capacity') }} <input v-model.number="form.maxSimultaneousOrders" type="number" /></label>
      <button @click="save">{{ $t('save') }}</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, reactive } from 'vue';

const weekdays = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const restaurantId = 'replace-me';
const form = reactive({
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  leadTimeMinutes: 20,
  maxSimultaneousOrders: 50,
  weeklyRules: [],
  exceptions: []
});

onMounted(async () => {
  const res = await axios.get(`/api/schedules/restaurants/${restaurantId}/schedule`);
  Object.assign(form, res.data || {});
});

function addRule(weekday) {
  form.weeklyRules.push({ weekday, startTime: '09:00:00', endTime: '14:00:00', isOpen: true });
}

function removeRule(id) {
  form.weeklyRules = form.weeklyRules.filter((r) => r.id !== id);
}

function addException() {
  form.exceptions.push({ date: new Date().toISOString().slice(0, 10), isOpen: false });
}

function removeException(id) {
  form.exceptions = form.exceptions.filter((e) => e.id !== id);
}

async function save() {
  await axios.post(`/api/schedules/restaurants/${restaurantId}/schedule`, form);
  alert('Saved');
}
</script>
