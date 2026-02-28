import React, { useState } from "react";

export default function EditProfileForm({ profile }: { profile: any }) {
  const [form, setForm] = useState(profile);

  const saveProfile = async () => {
    await fetch(`/api/profiles/${profile.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); void saveProfile(); }}>
      <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
      <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <button type="submit">Save</button>
    </form>
  );
}
