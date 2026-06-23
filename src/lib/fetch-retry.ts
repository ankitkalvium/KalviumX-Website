// Retries a fetch once on network failure or 5xx — covers transient blips
// (DNS hiccup, Apps Script cold start, Zoho rate limit) without building a
// full retry queue. 4xx responses are not retried since a retry won't fix
// a client error.
export async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  try {
    const res = await fetch(url, init);
    if (res.ok || res.status < 500) return res;
    await new Promise((resolve) => setTimeout(resolve, 300));
    return await fetch(url, init);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return await fetch(url, init);
  }
}
