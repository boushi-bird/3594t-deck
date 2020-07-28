import type { Strategy } from '3594t-deck';
import type { StrategiesFilterCondition } from '../../modules/datalist';
import { includeText, includeSearchText } from './includeSearchText';

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
  if (
    searchName.length > 0 &&
    !includeSearchText(strategy.nameSearchText, searchName, 'and')
  ) {
    return false;
  }
  // 計略説明検索
  if (searchExplanation.length > 0) {
    if (!includeText(strategy.explanation, searchExplanation, 'and')) {
      return false;
    }
  }
  return true;
};
