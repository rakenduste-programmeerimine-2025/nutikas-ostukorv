import type { TextMatchingHelpers } from '@/lib/product-matching'

/**
 * Text matching rules for the "maitseained" (spices) category.
 *
 * This is where you keep STOP words and name-normalisation logic that are
 * specific to spices. When you add other categories, create a similar file
 * under lib/product-category/<slug>/product-matching.ts.
 */
export function createMaitseainedTextMatchingHelpers(): TextMatchingHelpers {
  const STOP_WORDS = new Set([
    // brands / stores
    'santa',
    'maria',
    'rimi',
    'selver',
    'coop',
    'smart',
    'anatols',
    'dr',
    'oetker',
    'meira',
    'kotanyi',
    'ica',
    'kati',
    'nordic',
    'veski',
    'mati',
    'dan',
    'sukker',
    'diamant',
    'first',
    'price',
    // generic descriptors
    'klassikaline',
    'maitseaine',
    'maitseained',
    'maitseainesegu',
    'segu',
    'mix',
    'pulber',
    'jahvatatud',
    'purustatud',
    'hakitud',
    'viilutatud',
    'laastud',
    'premium',
    'classic',
  ])

  function normalize(name: string): string {
    return name
      .toLowerCase()
      // remove common brand phrases
      .replace(/santa\s+maria/g, ' ')
      .replace(/rimi\s+smart/g, ' ')
      .replace(/first\s+price/g, ' ')
      .replace(/veski\s+mati/g, ' ')
      .replace(/dan\s+sukker/g, ' ')
      // drop quantity markers with units ("30 g", "0,5g", etc.)
      .replace(/\d+[.,]?\d*\s*(kg|g|l|ml|tk)\b/g, ' ')
      // drop standalone numbers
      .replace(/\b\d+[.,]?\d*\b/g, ' ')
      .replace(/[,;:%()]/g, ' ')
  }

  function tokens(name: string): string[] {
    return normalize(name)
      .replace(/[^a-zäöõü0-9]+/g, ' ')
      .split(' ')
      .map(t => t.trim())
      .filter(t => t && !STOP_WORDS.has(t))
  }

  function extractCoreKey(name: string): string | null {
    const toks = tokens(name)
    if (toks.length === 0) return null

    // Try to pick the most "item-like" token first (things ending with
    // maitseaine / pipar / sool / suhkur / paprika etc.).
    const primary = toks.find(t =>
      /(maitseaine|pipar|sool|suhkur|paprika|rosmariin|kurkum|karri|safran|till|kaneel)/.test(
        t
      )
    )

    const key = (primary ?? toks.join(' ')).trim()
    return key || null
  }

  return { tokens, extractCoreKey }
}
