const CSS_COLOR = /^(#|(rgb|hsl|hwb|lab|lch|oklab|oklch)a?\(|color\(|var\(|transparent$|currentcolor$|inherit$)/i

export function resolveColor(value, fallback = ``)
{
  const raw = String(value ?? ``).trim() || String(fallback ?? ``).trim()

  if (raw === ``) return undefined
  if (CSS_COLOR.test(raw)) return raw

  return `var(--${raw.replace(/^--/, '')})`
}
