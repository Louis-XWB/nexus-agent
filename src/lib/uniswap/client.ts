const UNISWAP_API_BASE = "https://trade-api.gateway.uniswap.org/v1";

function getHeaders(): Record<string, string> {
  const apiKey = process.env.UNISWAP_API_KEY;
  if (!apiKey) throw new Error("Missing UNISWAP_API_KEY");
  return { "Content-Type": "application/json", "x-api-key": apiKey };
}

export async function uniswapPost<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${UNISWAP_API_BASE}${endpoint}`, {
    method: "POST", headers: getHeaders(), body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Uniswap API error ${response.status}: ${text}`);
  }
  return response.json() as Promise<T>;
}
