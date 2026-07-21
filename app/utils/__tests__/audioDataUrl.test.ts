import { parseAudioDataUrl } from '../audioDataUrl'

describe('roleplay audio data URLs', () => {
  test.each([
    ['data:audio/webm;base64,QUJDRA==', 'webm'],
    ['data:audio/webm;codecs=opus;base64,QUJDRA==', 'webm'],
    ['data:audio/wav;base64,QUJDRA==', 'wav'],
    ['data:audio/mp4;base64,QUJDRA==', 'm4a'],
    ['data:audio/mpeg;base64,QUJDRA==', 'mp3'],
    ['data:audio/ogg;base64,QUJDRA==', 'ogg'],
    ['data:audio/aac;base64,QUJDRA==', 'aac'],
  ])('maps %s to %s', (dataUrl, expectedFormat) => {
    expect(parseAudioDataUrl(dataUrl)).toEqual({ format: expectedFormat, base64: 'QUJDRA==' })
  })

  test('rejects non-audio and unsupported formats', () => {
    expect(parseAudioDataUrl('data:text/plain;base64,QUJDRA==')).toBeNull()
    expect(parseAudioDataUrl('data:audio/flac;base64,QUJDRA==')).toBeNull()
  })
})
