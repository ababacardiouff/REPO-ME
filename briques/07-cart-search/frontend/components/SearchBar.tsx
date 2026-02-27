import { useMemo, useState } from "react";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const recognition = useMemo(() => {
    if (typeof window === "undefined") return null;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    return SpeechRecognition ? new SpeechRecognition() : null;
  }, []);

  const doSearch = async (query: string) => {
    setQ(query);
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    setResults(await res.json());
  };

  const onVoiceSearch = () => {
    if (!recognition) return;
    recognition.lang = "fr-FR";
    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      void doSearch(transcript);
    };
    recognition.start();
  };

  const onImageSearch = async (file?: File) => {
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    const res = await fetch("/api/search/image", { method: "POST", body });
    setResults(await res.json());
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex gap-2">
        <input
          type="text"
          value={q}
          onFocus={() => doSearch("")}
          onChange={(e) => doSearch(e.target.value)}
          placeholder="Search dishes, restaurants, cuisines..."
          className="w-full rounded-xl border p-2"
        />
        <button onClick={onVoiceSearch} className="rounded-xl border px-3">🎙️</button>
        <label className="rounded-xl border px-3 py-2 cursor-pointer">
          📷
          <input type="file" className="hidden" accept="image/*" onChange={(e) => onImageSearch(e.target.files?.[0])} />
        </label>
      </div>
      {results.length > 0 && (
        <div className="absolute mt-1 bg-white rounded-lg shadow-lg w-full z-10">
          {results.map((r) => (
            <div key={r.id} className="p-2 hover:bg-gray-100">
              {r.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
