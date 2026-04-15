export const getTavusRuntimeConfig = () => ({
  enabled: import.meta.env.VITE_TAVUS_ENABLED === 'true'
})

export const buildTavusEchoMessage = (text) => ({
  message_type: 'conversation',
  event_type: 'conversation.echo',
  properties: {
    modality: 'text',
    inference_id: crypto.randomUUID(),
    text
  }
})
