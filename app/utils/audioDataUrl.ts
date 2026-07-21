const AUDIO_FORMATS: Record<string, string> = {
  webm: 'webm',
  wav: 'wav',
  'x-wav': 'wav',
  mp4: 'm4a',
  mpeg: 'mp3',
  ogg: 'ogg',
  aac: 'aac',
}

export interface ParsedAudioDataUrl {
  format: string
  base64: string
}

export function parseAudioDataUrl(value: string): ParsedAudioDataUrl | null {
  const match = value.match(
    /^data:audio\/(webm|wav|x-wav|mp4|mpeg|ogg|aac)(?:;codecs=[^;,]+)?;base64,([A-Za-z0-9+/=]+)$/,
  )
  if (!match) return null

  return { format: AUDIO_FORMATS[match[1]], base64: match[2] }
}
