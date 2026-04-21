const readEnv = (key) => import.meta.env[key]?.trim() || ''

export const isHeadTtsSupported = () =>
  typeof window !== 'undefined' &&
  typeof Worker !== 'undefined' &&
  Boolean(window.AudioContext || window.webkitAudioContext)

export const getHeadTtsRuntimeConfig = () => ({
  enabled: readEnv('VITE_HEADTTS_ENABLED') !== 'false',
  preferredVoice: readEnv('VITE_HEADTTS_VOICE') || 'af_bella',
  preloadVoices: readEnv('VITE_HEADTTS_PRELOAD_VOICES')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
  speed: Number(readEnv('VITE_HEADTTS_SPEED')) || 1
})

export const getHeadTtsEndpoints = () => {
  if (typeof navigator !== 'undefined' && navigator.gpu) {
    return ['webgpu', 'wasm']
  }

  return ['wasm']
}

export const getHeadTtsVoiceGender = (voiceId = '') =>
  voiceId.toLowerCase().startsWith('am_') ? 'male' : 'female'
