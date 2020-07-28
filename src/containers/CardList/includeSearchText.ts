import toNarrowKatakana from 'jaco/fn/toNarrowKatakana';
import toBasicLetter from 'jaco/fn/toBasicLetter';
import { SearchText } from '3594t-deck';

type SearchMode = 'or' | 'and';

export function includeText(
  target: string | undefined,
  searchText: string,
  searchMode: SearchMode
): boolean {
  if (target == null) {
    return false;
  }
  const search = searchText.split(/\s+/g).filter((s) => s.length > 0);
  if (searchMode === 'or') {
    return search.some((s) => target.includes(s));
  } else {
    return search.every((s) => target.includes(s));
  }
}

export function includeTextRuby(
  targetRuby: string | undefined,
  searchText: string,
  searchMode: SearchMode
): boolean {
  if (targetRuby == null) {
    return false;
  }
  const search = searchText
    .split(/\s+/g)
    .filter((s) => s.length > 0)
    .map((s) => toNarrowKatakana(toBasicLetter(s), true).replace(/[ﾞﾟ]/g, ''));
  if (searchMode === 'or') {
    return search.some((s) => targetRuby.includes(s));
  } else {
    return search.every((s) => targetRuby.includes(s));
  }
}

export function includeSearchText(
  targetSearchText: SearchText | null,
  searchText: string,
  searchMode: SearchMode
): boolean {
  if (!targetSearchText) {
    return false;
  }
  const { text, ruby } = targetSearchText;
  if (
    !includeText(text, searchText, searchMode) &&
    !includeTextRuby(ruby, searchText, searchMode)
  ) {
    return false;
  }
  return true;
}
