import React from "react";

interface Profile {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

export default function ProfileDashboard({ profile }: { profile: Profile }) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">My Profile</h1>
      <p>{profile.first_name} {profile.last_name}</p>
      <p>{profile.email} / {profile.phone}</p>
    </div>
  );
}
