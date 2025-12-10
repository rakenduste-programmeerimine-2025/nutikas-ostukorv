import type { TextMatchingHelpers } from '@/lib/product-matching'

/**
 * Text matching rules for the "pagaritooted" (bakery / bread) category.
 *
 * This is where you keep STOP words and name-normalisation logic that are
 * specific to bakery items. The goal is that the same product coming from
 * different stores (Coop / Rimi / Selver) normalises to the same core key so
 * the price-comparison endpoint can reliably match them.
 */
export function createPagaritootedTextMatchingHelpers(): TextMatchingHelpers {
  const STOP_WORDS = new Set([
    // brands / stores
    'coop',
    'rimi',
    'selver',
    'leibur',
    'fazer',
    'schär',
    'schar',
    'dr',
    'hiiumaa',
    'leivatööstus',
    // generic descriptors
    'viil',
    'viilutatud',
    'täistera',
    'mitmevilja',
    'mini',
    'suur',
    'xxl',
    'street',
    'food',
    'gluteenivaba',
    'gl',
    'vaba',
  ])

  function normalize(name: string): string {
    return name
      .toLowerCase()
      // remove common brand phrases
      .replace(/eesti\s+pagar/g, ' ')
      .replace(/hiiumaa\s+pagar/g, ' ')
      .replace(/street\s+food/g, ' ')
      .replace(/dr\.?\s*sch[aä]r/g, ' ')
      // drop quantity markers with units ("500 g", "0,7kg", "4*50g" etc.)
      .replace(/\d+[.,]?\d*\s*(kg|g|l|ml|tk)\b/g, ' ')
      // drop standalone numbers (sizes, counts)
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

    // For bakery items, the full token string (without brands, sizes etc.) is
    // usually specific enough (e.g. "kuldne klassikaline röstsai",
    // "perenaise sai", "kodukandi rukkileib").
    const key = toks.join(' ').trim()
    return key || null
  }

  return { tokens, extractCoreKey }
}
