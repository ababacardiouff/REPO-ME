export default function SearchResults({ results }: { results: Array<{ id: string; name: string; score?: number }> }) {
  if (!results.length) {
    return <div className="text-sm text-gray-500">No results found.</div>;
  }

  return (
    <div className="space-y-2">
      {results.map((result) => (
        <div key={result.id} className="rounded-lg border p-3 flex justify-between">
          <span>{result.name}</span>
          {typeof result.score === "number" && <span className="text-xs text-gray-500">Score: {result.score}</span>}
        </div>
      ))}
    </div>
  );
}
