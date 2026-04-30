const monitoringEndpoint = import.meta.env.VITE_MONITORING_ENDPOINT?.trim()
const sentryDsn = import.meta.env.VITE_SENTRY_DSN?.trim()

export const captureException = (error, context = {}) => {
  const payload = {
    message: error?.message || String(error),
    stack: error?.stack,
    context,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  }

  if (monitoringEndpoint) {
    navigator.sendBeacon?.(monitoringEndpoint, JSON.stringify(payload))
  }

  if (sentryDsn) {
    console.warn('VITE_SENTRY_DSN is configured. Install @sentry/react to enable full Sentry tracing.', payload)
  } else {
    console.error('Captured app error', payload)
  }
}

export const initMonitoring = () => {
  window.addEventListener('error', (event) => {
    captureException(event.error || event.message, { source: 'window.error' })
  })

  window.addEventListener('unhandledrejection', (event) => {
    captureException(event.reason, { source: 'unhandledrejection' })
  })
}
