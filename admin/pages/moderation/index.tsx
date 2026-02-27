import React, { useEffect, useState } from "react";

export default function ModerationList() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/moderation/requests").then((r) => r.json()).then(setItems);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Moderation Requests</h1>
      <table className="w-full mt-4">
        <thead>
          <tr>
            <th>ID</th><th>Source</th><th>Status</th><th>Created</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.source}</td>
              <td>{it.status}</td>
              <td>{new Date(it.created_at).toLocaleString()}</td>
              <td><a href={`/admin/moderation/${it.id}`} className="text-blue-600">View</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
