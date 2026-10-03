export async function callRailway(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.RAILWAY_API_URL?.replace(/\/$/, "");
  const internalKey = process.env.RAILWAY_INTERNAL_API_KEY;
  if (!baseUrl || !internalKey) throw new Error("Railway API is not configured.");

  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
      "x-internal-api-key": internalKey,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
}