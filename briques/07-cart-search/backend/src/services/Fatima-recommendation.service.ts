export const FatimaRecommendation = async (userId: string, context: "cart" | "search") => {
  return fetch(`${process.env.FATIMA_API}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, context })
  }).then((r) => r.json());
};
