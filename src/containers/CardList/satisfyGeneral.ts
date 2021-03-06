import type { General } from '3594t-deck';
import type { FilterCondition } from '../../modules/datalist';
import { includeSearchText } from './includeSearchText';

export default (
  general: General,
  filterCondition: FilterCondition
): boolean => {
  const {
    belongStates,
    costs,
    unitTypes,
    forceMin,
    forceMax,
    useCostRatioForce,
    costRatioForceMin,
    costRatioForceMax,
    costRatioBaseForces,
    intelligenceMin,
    intelligenceMax,
    conquestMin,
    conquestMax,
    skills,
    skillsAnd,
    searchText,
  } = filterCondition.basic;
  // 勢力
  if (belongStates.length > 0 && !belongStates.includes(general.state.id)) {
    return false;
  }
  // コスト
  if (costs.length > 0 && !costs.includes(general.cost.id)) {
    return false;
  }
  // 兵種
  if (unitTypes.length > 0 && !unitTypes.includes(general.unitType.id)) {
    return false;
  }
  // 武力
  if (useCostRatioForce) {
    const costRatioBaseForce = costRatioBaseForces[general.cost.id];
    if (costRatioBaseForce == null) {
      return false;
    }
    const costRatioForce = general.force - costRatioBaseForce;
    if (costRatioForceMin > costRatioForce) {
      return false;
    }
    if (costRatioForceMax < costRatioForce) {
      return false;
    }
  } else {
    if (forceMin > general.force) {
      return false;
    }
    if (forceMax < general.force) {
      return false;
    }
  }
  // 知力
  if (intelligenceMin > general.intelligence) {
    return false;
  }
  if (intelligenceMax < general.intelligence) {
    return false;
  }
  // 征圧力
  if (conquestMin > general.conquest) {
    return false;
  }
  if (conquestMax < general.conquest) {
    return false;
  }
  // 特技
  if (skills.length > 0) {
    const hasSkill = (v: string): boolean => {
      if (v === '0') {
        return general.skills.length === 0;
      }
      return general.skills.map((s) => s.id).includes(v);
    };
    if (skillsAnd) {
      if (!skills.every(hasSkill)) {
        return false;
      }
    } else {
      if (!skills.some(hasSkill)) {
        return false;
      }
    }
  }
  const {
    genMains,
    genMainsAnd,
    rarities,
    generalTypes,
    verTypes,
    versions,
    majorVersions,
    enableDetailVersion,
    pockets,
  } = filterCondition.detail;
  // レアリティ
  if (rarities.length > 0 && !rarities.includes(general.rarity.id)) {
    return false;
  }
  // 登場弾
  if (enableDetailVersion) {
    if (versions.length > 0 && !versions.includes(general.versionValue)) {
      return false;
    }
  } else {
    if (
      majorVersions.length > 0 &&
      !majorVersions.includes(`${general.majorVersion}`)
    ) {
      return false;
    }
  }
  // 主将器
  if (genMains.length > 0) {
    const hasGenMain = (v: string): boolean =>
      general.genMains.map((s) => s.id).includes(v);
    if (genMainsAnd) {
      if (!genMains.every(hasGenMain)) {
        return false;
      }
    } else {
      if (!genMains.some(hasGenMain)) {
        return false;
      }
    }
  }
  // 官職
  if (
    generalTypes.length > 0 &&
    !generalTypes.includes(general.generalType.id)
  ) {
    return false;
  }
  // カード種別
  if (verTypes.length > 0 && !verTypes.includes(general.verType)) {
    return false;
  }
  // ぽけっと武将
  if (
    pockets.length === 1 &&
    (pockets[0] === '1') !== (general.pocketCode !== '')
  ) {
    return false;
  }
  if (
    searchText.length > 0 &&
    !includeSearchText(general.personal.nameSearchText, searchText, 'or')
  ) {
    return false;
  }
  return true;
};
