import { getApiErrorMessage, readApiPayload } from '../apiResponse'

describe('API response parsing', () => {
  test('reads an object JSON response', async () => {
    const response = new Response(JSON.stringify({ success: true, sessionId: 'roleplay_12345678' }))

    await expect(readApiPayload(response, 'Unavailable')).resolves.toEqual({
      success: true,
      sessionId: 'roleplay_12345678',
    })
  })

  test('replaces an HTML platform response with a customer-safe message', async () => {
    const response = new Response('<!DOCTYPE html><title>Gateway timeout</title>', { status: 504 })

    await expect(readApiPayload(response, 'The service is temporarily unavailable.')).rejects.toThrow(
      'The service is temporarily unavailable.',
    )
  })

  test('prefers a customer-facing message over a machine error code', () => {
    expect(getApiErrorMessage(
      { error: 'grading_failed', message: 'Please try the recording again.' },
      'Unavailable',
    )).toBe('Please try the recording again.')
  })
})
