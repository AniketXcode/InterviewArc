const experiments = {
  homeCta: ['Start AI Interview', 'Practice for Free'],
}

export const getVariant = (experimentName) => {
  const variants = experiments[experimentName] || []
  if (!variants.length) return null

  const storageKey = `experiment:${experimentName}`
  const savedVariant = localStorage.getItem(storageKey)
  if (variants.includes(savedVariant)) return savedVariant

  const variant = variants[Math.floor(Math.random() * variants.length)]
  localStorage.setItem(storageKey, variant)
  return variant
}
