import type { Strategy } from '3594t-deck';
import type { StrategiesFilterCondition } from '../../modules/datalist';
import toNarrowKatakana from 'jaco/fn/toNarrowKatakana';
import toBasicLetter from 'jaco/fn/toBasicLetter';

function includeSearchText(
  target: string | undefined,
  searchText: string
): boolean {
  if (target == null) {
    return false;
  }
  const search = searchText.split(/\s+/g).filter((s) => s.length > 0);
  return search.every((s) => target.includes(s));
}

function includeSearchTextRuby(
  targetRuby: string | undefined,
  searchText: string
): boolean {
  if (targetRuby == null) {
    return false;
  }
  const search = searchText
    .split(/\s+/g)
    .filter((s) => s.length > 0)
    .map((s) => toNarrowKatakana(toBasicLetter(s), true).replace(/[ﾞﾟ]/g, ''));
  return search.every((s) => targetRuby.includes(s));
}

export default (
  strategy: Strategy,
  filter: StrategiesFilterCondition
): boolean => {
  const {
    moraleMin,
    moraleMax,
    strategyCategories: categories,
    strategyRanges: ranges,
    strategyTimes: times,
    strategySearchName: searchName,
    strategySearchExplanation: searchExplanation,
  } = filter;
  if (moraleMin > strategy.morale) {
    return false;
  }
  if (moraleMax < strategy.morale) {
    return false;
  }
  // カテゴリ
  if (categories.length > 0 && !categories.includes(strategy.stratCategory)) {
    return false;
  }
  // 範囲
  if (ranges.length > 0 && !ranges.includes(strategy.stratRange)) {
    return false;
  }
  // 効果時間
  if (times.length > 0 && !times.includes(strategy.stratTime)) {
    return false;
  }
  // 計略名検索
  if (searchName.length > 0) {
    if (!strategy.nameSearchText) {
      return false;
    }
    const { text, ruby } = strategy.nameSearchText;
    if (
      !includeSearchText(text, searchName) &&
      !includeSearchTextRuby(ruby, searchName)
    ) {
      return false;
    }
  }
  // 計略説明検索
  if (searchExplanation.length > 0) {
    if (!strategy.explanation) {
      return false;
    }
    if (!includeSearchText(strategy.explanation, searchExplanation)) {
      return false;
    }
  }
  return true;
};
