export interface TextMatchingHelpers {
  tokens: (name: string) => string[]
  extractCoreKey: (name: string) => string | null
}

// Generic, conservative helpers for categories without custom config.
function createGenericHelpers(): TextMatchingHelpers {
  function normalize(name: string): string {
    return name.toLowerCase()
  }

  function tokens(name: string): string[] {
    return normalize(name)
      .replace(/[^a-zäöõü0-9]+/g, ' ')
      .split(' ')
      .map(t => t.trim())
      .filter(Boolean)
  }

  function extractCoreKey(name: string): string | null {
    const toks = tokens(name)
    if (toks.length === 0) return null
    return toks.join(' ')
  }

  return { tokens, extractCoreKey }
}

// Import per-category helpers. Each category keeps its own matching rules
// close to its data/migrations under lib/product-category/<slug>/.
import { createMaitseainedTextMatchingHelpers } from '@/lib/product-category/maitseained/product-matching'

/**
 * Get text-matching helpers for a given category slug.
 *
 * As you add new categories, create a
 *   lib/product-category/<slug>/product-matching.ts
 * file that exports a create<Slug>TextMatchingHelpers() function and wire it
 * into the switch below.
 */
export function getTextMatchingHelpersForCategorySlug(
  slug: string | null | undefined
): TextMatchingHelpers {
  if (!slug) return createGenericHelpers()

  switch (slug) {
    case 'maitseained':
      return createMaitseainedTextMatchingHelpers()
    default:
      return createGenericHelpers()
  }
}
