export interface ApiPayload {
  error?: unknown
  message?: unknown
  [key: string]: unknown
}

/**
 * Read an API response without exposing an HTML proxy or platform error to the UI.
 */
export async function readApiPayload<T extends ApiPayload>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const responseText = await response.text()

  if (!responseText.trim()) {
    throw new Error(fallbackMessage)
  }

  try {
    const payload = JSON.parse(responseText)
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw new Error('Invalid API payload')
    }
    return payload as T
  } catch {
    throw new Error(fallbackMessage)
  }
}

export function getApiErrorMessage(payload: ApiPayload, fallbackMessage: string): string {
  if (typeof payload.message === 'string' && payload.message.trim()) return payload.message
  if (typeof payload.error === 'string' && payload.error.trim()) return payload.error
  return fallbackMessage
}
