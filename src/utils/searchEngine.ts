import { SearchIndexItem, staticSearchIndex } from '@/config/search-index';

export interface SearchResult {
  item: SearchIndexItem;
  score: number;
  matchedTokens: string[];
}

/**
 * Computes Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks if candidate is a fuzzy match for query token
 */
function isFuzzyMatch(queryToken: string, candidate: string): boolean {
  if (candidate.includes(queryToken)) return true;
  if (queryToken.length < 4) return false;

  const maxDist = queryToken.length >= 7 ? 2 : 1;
  const dist = levenshteinDistance(queryToken, candidate);
  return dist <= maxDist;
}

/**
 * Executes high-performance client-side search across the indexed dataset.
 * Supports exact matching, multi-token queries, synonym matches, and typo tolerance.
 */
export function executeSearch(
  rawQuery: string,
  index: SearchIndexItem[] = staticSearchIndex,
  maxResults = 25
): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const tokens = query.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  index.forEach((item) => {
    let score = 0;
    const matchedTokens = new Set<string>();

    const itemTitle = item.title.toLowerCase();
    const itemDesc = item.description.toLowerCase();
    const itemPath = (item.path || item.href).toLowerCase();
    const itemSection = (item.section || '').toLowerCase();
    const itemKeywords = item.keywords.map((k) => k.toLowerCase());

    // 1. Exact Full Query Matches
    if (itemTitle === query || itemPath === query) {
      score += 120;
      matchedTokens.add(query);
    } else if (itemTitle.startsWith(query) || itemPath.startsWith(query)) {
      score += 80;
      matchedTokens.add(query);
    } else if (itemTitle.includes(query) || itemPath.includes(query)) {
      score += 50;
      matchedTokens.add(query);
    }

    // Check if entire query matches a full synonym phrase
    const exactPhraseMatch = itemKeywords.some((k) => k === query || k.includes(query));
    if (exactPhraseMatch) {
      score += 45;
      matchedTokens.add(query);
    }

    // 2. Multi-Token Evaluation
    let allTokensMatched = true;

    tokens.forEach((token) => {
      let tokenScore = 0;

      // Title check
      if (itemTitle.includes(token)) {
        tokenScore += 30;
        matchedTokens.add(token);
      }

      // Path / Method check
      if (itemPath.includes(token) || (item.method && item.method.toLowerCase() === token)) {
        tokenScore += 25;
        matchedTokens.add(token);
      }

      // Keywords / Synonym list check
      const matchingKeyword = itemKeywords.find((k) => k.includes(token));
      if (matchingKeyword) {
        tokenScore += 20;
        matchedTokens.add(token);
      }

      // Description check
      if (itemDesc.includes(token)) {
        tokenScore += 10;
        matchedTokens.add(token);
      }

      // Section / Category check
      if (itemSection.includes(token) || item.category.toLowerCase().includes(token)) {
        tokenScore += 5;
        matchedTokens.add(token);
      }

      // Fuzzy Typo Tolerance (if no direct substring match found yet)
      if (tokenScore === 0 && token.length >= 4) {
        const titleWords = itemTitle.split(/[\s/:]+/);
        const fuzzyTitleMatch = titleWords.some((w) => isFuzzyMatch(token, w));

        if (fuzzyTitleMatch) {
          tokenScore += 18;
          matchedTokens.add(token);
        } else {
          const fuzzyKeywordMatch = itemKeywords.some((k) => {
            const kWords = k.split(/\s+/);
            return kWords.some((kw) => isFuzzyMatch(token, kw));
          });

          if (fuzzyKeywordMatch) {
            tokenScore += 14;
            matchedTokens.add(token);
          }
        }
      }

      if (tokenScore === 0) {
        allTokensMatched = false;
      } else {
        score += tokenScore;
      }
    });

    // Bonus for matching ALL tokens in a multi-word search
    if (tokens.length > 1 && allTokensMatched) {
      score += 35;
    }

    // Prioritize REST Endpoints or Guides slightly based on intent
    if (score > 0) {
      results.push({
        item,
        score,
        matchedTokens: Array.from(matchedTokens),
      });
    }
  });

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}
