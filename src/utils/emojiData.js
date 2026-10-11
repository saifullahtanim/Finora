// Full Unicode World Emoji Dataset (3,950+ Emojis)
// Extracted from Unicode 17.0 standard (apple-emoji-ttf-2)
// Completely independent of any external files.

import UNICODE_EMOJIS from './unicodeEmojiDatabase.js';

export const EMOJI_DATABASE = UNICODE_EMOJIS;

// Curated top popular emojis shown initially before typing
export const DEFAULT_POPULAR_EMOJIS = [
  '🍔', '☕', '🛒', '🚗', '🏠', '⚡', '🎬', '💊',
  '🎓', '🎁', '💼', '💰', '✈️', '🏋️', '🎮', '📱',
  '🚁', '🐶', '🐱', '👟', '👕', '🍕', '🍜', '⛽',
  '📶', '🏥', '📚', '🕌', '🏖️', '💎', '⭐', '❤️',
  '🧑', '👥', '👶', '👪', '💵', '🪙', '💳', '🧾',
  '🏷️', '🍟', '🥪', '🥩', '🍗', '🐟', '🍎', '🍌',
  '🍦', '🍰', '🎂', '🍩', '🍫', '🍿', '🚲', '🏍️',
  '🚌', '🚆', '💡', '💧', '🔥', '🛋️', '🛠️', '🔑',
  '🩺', '🎒', '👓', '🕶️', '⌚', '💻', '🖥️', '🎧',
  '🎵', '⚽', '🏏', '🎉', '🎈', '🛍️', '✨', '🎯'
];

/**
 * Super-fast, zero-delay, comprehensive search over 3,950+ Unicode world emojis.
 * Matches:
 * - English names and synonyms (e.g. "drone", "dron", "people", "cat", "car", "shoe")
 * - Bengali phonetics/words (e.g. "biral", "kukur", "goru", "bhaat", "taka", "cha", "masjid")
 * - Multi-word queries (e.g. "fast food burger", "camera drone", "family people")
 * - Exact pasted emoji characters
 */
export function searchWorldEmojis(query) {
  if (!query || !query.trim()) {
    return DEFAULT_POPULAR_EMOJIS;
  }

  const raw = query.trim();

  // If user typed/pasted an exact emoji directly
  const exactEmojiMatch = EMOJI_DATABASE.find(item => item.emoji === raw);
  if (exactEmojiMatch) {
    return [exactEmojiMatch.emoji];
  }

  // Tokenize user query
  const tokens = raw
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);

  if (tokens.length === 0) {
    return DEFAULT_POPULAR_EMOJIS;
  }

  const scoredResults = [];

  for (let i = 0; i < EMOJI_DATABASE.length; i++) {
    const item = EMOJI_DATABASE[i];
    let matchesAllTokens = true;
    let totalScore = 0;
    const nameLower = item.name.toLowerCase();

    for (let j = 0; j < tokens.length; j++) {
      const token = tokens[j];
      let tokenMatch = false;
      let tokenScore = 0;

      // 1. Exact name match
      if (nameLower === token) {
        tokenMatch = true;
        tokenScore = Math.max(tokenScore, 200);
      } else if (nameLower.startsWith(token + ' ')) {
        tokenMatch = true;
        tokenScore = Math.max(tokenScore, 160);
      }

      // 2. Exact or prefix match in tags
      const tags = item.tags;
      for (let k = 0; k < tags.length; k++) {
        const tag = tags[k];
        if (tag === token) {
          tokenMatch = true;
          tokenScore = Math.max(tokenScore, 100);
          break;
        } else if (tag.startsWith(token)) {
          tokenMatch = true;
          const diff = tag.length - token.length;
          tokenScore = Math.max(tokenScore, 70 - Math.min(diff * 5, 30));
        } else if (token.length >= 4 && token.startsWith(tag) && tag.length >= 3) {
          // Plural / stem match: e.g. token "sports" matches tag "sport", "cars" matches "car"
          tokenMatch = true;
          tokenScore = Math.max(tokenScore, 80);
        }
      }

      // 3. Substring in name for queries of length >= 4
      if (!tokenMatch && token.length >= 4) {
        if (nameLower.includes(token) || (token.endsWith('s') && nameLower.includes(token.slice(0, -1)))) {
          tokenMatch = true;
          tokenScore = Math.max(tokenScore, 40);
        }
      }

      if (!tokenMatch) {
        matchesAllTokens = false;
        break;
      }

      totalScore += tokenScore;
    }

    if (matchesAllTokens) {
      scoredResults.push({ emoji: item.emoji, score: totalScore });
    }
  }

  // Sort by highest score first
  scoredResults.sort((a, b) => b.score - a.score);

  // Deduplicate and cap to 250 results for smooth 60fps UI rendering
  const seen = new Set();
  const finalResults = [];
  for (let i = 0; i < scoredResults.length; i++) {
    const em = scoredResults[i].emoji;
    if (!seen.has(em)) {
      seen.add(em);
      finalResults.push(em);
      if (finalResults.length >= 250) break;
    }
  }

  return finalResults;
}

export default EMOJI_DATABASE;
