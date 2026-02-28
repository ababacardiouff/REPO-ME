<template>
  <div>
    <h2>{{ $t('holiday.calendar') }}</h2>
    <HolidayCalendar :events="events" @select="onSelectEvent" />
    <button @click="openCreate">{{ $t('holiday.create') }}</button>

    <Modal v-if="editing">
      <form @submit.prevent="save">
        <label>{{ $t('holiday.name') }}<input v-model="form.name.fr" /></label>
        <label>{{ $t('holiday.start') }}<input type="date" v-model="form.startDate" /></label>
        <label>{{ $t('holiday.end') }}<input type="date" v-model="form.endDate" /></label>
        <label>
          <input v-model="form.isBlackout" type="checkbox" /> {{ $t('holiday.isBlackout') }}
        </label>
        <label>
          {{ $t('holiday.pricing') }}
          <input v-model.number="form.pricingValue" type="number" />
          <select v-model="form.pricingType">
            <option value="percent">%</option>
            <option value="fixed">fixed</option>
          </select>
        </label>
        <button type="submit">{{ $t('save') }}</button>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const events = ref([]);
const editing = ref(false);
const form = ref({
  name: { fr: '', en: '' },
  startDate: '',
  endDate: '',
  isBlackout: false,
  pricingType: 'percent',
  pricingValue: 0,
});
const restaurantId = 'resto-1';

onMounted(async () => {
  const res = await axios.get(`/api/holidays/restaurants/${restaurantId}/holidays`);
  events.value = res.data;
});

function onSelectEvent() {
  editing.value = true;
}

function openCreate() {
  editing.value = true;
}

async function save() {
  const payload = {
    restaurantId,
    scopeType: 'restaurant',
    name: { fr: form.value.name.fr, en: form.value.name.en },
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    isBlackout: form.value.isBlackout,
    pricingAdjustment: form.value.pricingValue
      ? { type: form.value.pricingType, value: form.value.pricingValue }
      : null,
  };

  await axios.post('/api/holidays', payload);
  editing.value = false;
  const res = await axios.get(`/api/holidays/restaurants/${restaurantId}/holidays`);
  events.value = res.data;
}
</script>
