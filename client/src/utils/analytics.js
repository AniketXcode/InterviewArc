export const initAnalytics = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim()

  if (gaId && !document.querySelector(`script[src*="${gaId}"]`)) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId)
  }

  if (plausibleDomain && !document.querySelector('script[data-domain]')) {
    const script = document.createElement('script')
    script.defer = true
    script.dataset.domain = plausibleDomain
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)
  }
}

export const trackEvent = (name, params = {}) => {
  window.gtag?.('event', name, params)
  window.plausible?.(name, { props: params })
}
