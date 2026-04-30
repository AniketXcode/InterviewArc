import { useEffect } from 'react'

const defaultImage = '/img1.png'

function upsertMeta(selector, attributes) {
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    document.head.appendChild(tag)
  }

  Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value))
}

function Seo({ title, description, keywords, image = defaultImage, type = 'website' }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | InterviewArc` : 'InterviewArc AI Interview Prep'
    const pageDescription =
      description ||
      'Practice realistic AI interviews, get adaptive follow-up questions, and improve with performance reports from InterviewArc.'
    const pageKeywords =
      keywords || 'AI interview preparation, mock interview, Amazon interview, technical interview, HR interview practice'
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`

    document.title = pageTitle
    upsertMeta('meta[name="description"]', { name: 'description', content: pageDescription })
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: pageKeywords })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: pageDescription })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: new URL(image, window.location.origin).href })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: pageDescription })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: new URL(image, window.location.origin).href })

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [description, image, keywords, title, type])

  return null
}

export default Seo
