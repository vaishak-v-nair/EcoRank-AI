const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function normalizeErrorMessage(status: number, fallback: string) {
  if (status === 0) {
    return 'Cannot reach backend API. Start the backend service on http://localhost:4000.';
  }
  return fallback || `Request failed with status ${status}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      },
      ...init
    });
  } catch (error) {
    throw new Error(
      normalizeErrorMessage(
        0,
        error instanceof Error ? error.message : 'Network request failed'
      )
    );
  }

  if (!response.ok) {
    const raw = await response.text();
    let message = raw;

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { error?: string; message?: string };
        message = parsed.error || parsed.message || raw;
      } catch {
        // keep raw response body
      }
    }

    throw new Error(normalizeErrorMessage(response.status, message));
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
