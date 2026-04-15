const readEnv = (key) => import.meta.env[key]?.trim() || ''

export const getVapiRuntimeConfig = () => ({
  publicKey: readEnv('VITE_VAPI_PUBLIC_KEY'),
  assistantId: readEnv('VITE_VAPI_ASSISTANT_ID'),
  useExistingAssistant: readEnv('VITE_VAPI_USE_EXISTING_ASSISTANT') === 'true',
  voiceProvider: readEnv('VITE_VAPI_VOICE_PROVIDER') || 'vapi',
  voiceId: readEnv('VITE_VAPI_VOICE_ID') || 'Elliot',
  transcriberProvider: readEnv('VITE_VAPI_TRANSCRIBER_PROVIDER') || 'deepgram',
  transcriberModel: readEnv('VITE_VAPI_TRANSCRIBER_MODEL') || 'nova-2',
  transcriberLanguage: readEnv('VITE_VAPI_TRANSCRIBER_LANGUAGE'),
  modelProvider: readEnv('VITE_VAPI_MODEL_PROVIDER') || 'openai',
  modelName: readEnv('VITE_VAPI_MODEL_NAME') || 'gpt-4.1-mini'
})

export const createInterviewVapiAssistant = () => {
  const config = getVapiRuntimeConfig()

  return {
    name: 'InterviewArc Voice Runtime',
    firstMessage: '',
    firstMessageMode: 'assistant-waits-for-user',
    silenceTimeoutSeconds: 180,
    maxDurationSeconds: 1800,
    backgroundSound: 'off',
    clientMessages: ['transcript'],
    modelOutputInMessagesEnabled: true,
    model: {
      provider: config.modelProvider,
      model: config.modelName,
      messages: [
        {
          role: 'system',
          content:
            'You are the silent voice runtime for an interview app. The app controls every spoken line with explicit say commands. Never greet the user, never ask your own questions, never react to user speech, and never speak unless the app explicitly triggers speech. Your job is to keep the session connected and transcribe the user accurately.'
        }
      ]
    },
    voice: {
      provider: config.voiceProvider,
      voiceId: config.voiceId
    },
    transcriber: {
      provider: config.transcriberProvider,
      model: config.transcriberModel,
      ...(config.transcriberLanguage ? { language: config.transcriberLanguage } : {})
    }
  }
}
