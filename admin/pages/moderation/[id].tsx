import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ModerationView() {
  const router = useRouter();
  const { id } = router.query;
  const [reqObj, setReqObj] = useState<any>(null);

  useEffect(() => {
    if (id) fetch(`/api/admin/moderation/requests/${id}`).then((r) => r.json()).then(setReqObj);
  }, [id]);

  async function override(action: string) {
    const note = prompt("Note for audit") || "";
    const body: any = { action, note };
    if (action === "SANITIZE") body.sanitizedText = prompt("Sanitized text") || "";

    await fetch(`/api/admin/moderation/requests/${id}/override`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    alert("Override sent");
  }

  if (!reqObj) return <div>Loading...</div>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Moderation {reqObj.id}</h1>
      <pre className="bg-gray-100 p-4 rounded mt-4">{JSON.stringify(reqObj, null, 2)}</pre>
      <div className="mt-4 flex gap-2">
        <button onClick={() => override("ALLOW")} className="btn">Allow</button>
        <button onClick={() => override("SANITIZE")} className="btn">Sanitize</button>
        <button onClick={() => override("BLOCK")} className="btn-danger">Block</button>
      </div>
    </div>
  );
}
