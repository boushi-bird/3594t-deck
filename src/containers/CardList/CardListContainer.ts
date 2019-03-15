import { connect } from 'react-redux';
import { State } from '../../store';
import CardList, { StateFromProps, DispatchFromProps } from './CardList';

const satisfyGeneral = (
  general: StateFromProps['generals'][number],
  filterCondition: State['datalistReducer']['filterCondition']
): boolean => {
  const {
    belongStates,
    costs,
    unitTypes,
    skills,
    skillsAnd,
    genMains,
    genMainsAnd,
    rarities,
    generalTypes,
    varTypes,
    versions,
    majorVersions,
    enableDetailVersion,
    pockets,
  } = filterCondition;
  const { raw } = general;
  // 勢力
  if (belongStates.length > 0 && !belongStates.includes(raw.state)) {
    return false;
  }
  // コスト
  if (costs.length > 0 && !costs.includes(raw.cost)) {
    return false;
  }
  // 兵種
  if (unitTypes.length > 0 && !unitTypes.includes(raw.unit_type)) {
    return false;
  }
  // 特技
  if (skills.length > 0) {
    const hasSkill = (v: string): boolean => {
      if (v === '0') {
        return general.skills.length === 0;
      }
      return general.skills.map(s => s.id).includes(v);
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
  // レアリティ
  if (rarities.length > 0 && !rarities.includes(raw.rarity)) {
    return false;
  }
  if (enableDetailVersion) {
    if (versions.length > 0 && !versions.includes(general.versionValue)) {
      return false;
    }
  } else {
    if (
      majorVersions.length > 0 &&
      !majorVersions.includes(raw.major_version)
    ) {
      return false;
    }
  }
  // 登場弾
  if (genMains.length > 0) {
    const hasGenMain = (v: string): boolean =>
      general.genMains.map(s => s.id).includes(v);
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
  if (generalTypes.length > 0 && !generalTypes.includes(raw.general_type)) {
    return false;
  }
  // カード種別
  if (varTypes.length > 0 && !varTypes.includes(raw.ver_type)) {
    return false;
  }
  // ぽけっと武将
  if (
    pockets.length === 1 &&
    (pockets[0] === '1') !== (raw.pocket_code !== '')
  ) {
    return false;
  }
  return true;
};

export default connect<StateFromProps, DispatchFromProps>(
  (state: State) => {
    const {
      generals,
      effectiveFilterCondition: filterCondition,
    } = state.datalistReducer;
    const searchedGeneralIds = generals
      .filter(general => {
        return satisfyGeneral(general, filterCondition);
      })
      .map(v => v.id);
    return {
      generals,
      searchedGeneralIds,
    };
  },
  () => ({})
)(CardList);
