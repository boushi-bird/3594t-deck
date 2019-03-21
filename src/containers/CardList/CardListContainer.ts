import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { datalistActions } from '../../modules/datalist';
import { deckActions, DeckCard } from '../../modules/deck';
import { State } from '../../store';
import CardList, { StateFromProps, DispatchFromProps } from './CardList';

type General = StateFromProps['generals'][number];
type FilterCondition = State['datalistReducer']['filterCondition'];

const satisfyGeneral = (
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
  // 武力
  if (useCostRatioForce) {
    const costRatioBaseForce = costRatioBaseForces[general.raw.cost];
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

interface DeckCardGeneral {
  general: string;
  cost: string;
  genMain?: string;
}

interface ContainerStateFromProps {
  generals: General[];
  currentPage: number;
  pageLimit: number;
  filterCondition: FilterCondition;
  deckCards: DeckCard[];
  activeIndex?: number;
}

interface ContainerDispatchFromProps {
  changeDeckGeneral: (index: number, card: DeckCardGeneral) => void;
  addDeckGeneral: (card: DeckCardGeneral) => void;
  decrementPage: () => void;
  incrementPage: () => void;
}

const arrayEquals = <V>(a: V[], b: V[]): boolean =>
  a.length === b.length && a.every(v => b.includes(v));

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => ({
    generals: state.datalistReducer.generals,
    currentPage: state.datalistReducer.currentPage,
    pageLimit: state.datalistReducer.pageLimit,
    filterCondition: state.datalistReducer.effectiveFilterCondition,
    deckCards: state.deckReducer.deckCards,
    activeIndex: state.deckReducer.activeIndex,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        changeDeckGeneral: deckActions.changeDeckGeneral,
        addDeckGeneral: deckActions.addDeckGeneral,
        decrementPage: datalistActions.decrementPage,
        incrementPage: datalistActions.incrementPage,
      },
      dispatch
    ),
  (state, actions) => {
    const {
      generals,
      currentPage,
      pageLimit,
      filterCondition,
      deckCards,
      activeIndex,
    } = state;
    const deckGenerals: string[] = [];
    deckCards.forEach((deckCard, i) => {
      if (activeIndex === i) {
        return;
      }
      const general = deckCard.general;
      if (general) {
        deckGenerals.push(general);
      }
    });
    // デッキにいる武将(武将名単位)
    const deckPersonals = generals
      .filter(general => {
        return deckGenerals.includes(general.id);
      })
      .map(v => v.raw.personal);
    let searchedGeneralIds = generals
      .filter(general => {
        return satisfyGeneral(general, filterCondition);
      })
      .map(v => v.id);
    const searchedAll = searchedGeneralIds.length;
    const searchedOffset = (currentPage - 1) * pageLimit;
    const hasPrev = searchedOffset > 0;
    const hasNext = searchedOffset + pageLimit < searchedAll;
    searchedGeneralIds = searchedGeneralIds.slice(
      searchedOffset,
      searchedOffset + pageLimit
    );
    return {
      generals,
      searchedGeneralIds,
      deckPersonals,
      searchedAll,
      searchedOffset,
      searchedLimit: pageLimit,
      hasPrev,
      hasNext,
      addDeckGeneral: (card: {
        general: string;
        cost: string;
        genMain?: string;
      }) => {
        if (activeIndex != null) {
          actions.changeDeckGeneral(activeIndex, card);
        } else {
          actions.addDeckGeneral(card);
        }
      },
      onPagePrev: actions.decrementPage,
      onPageNext: actions.incrementPage,
    };
  },
  {
    areMergedPropsEqual: (nextMergedProps, prevMergedProps) => {
      if (nextMergedProps.searchedAll !== prevMergedProps.searchedAll) {
        return false;
      }
      if (nextMergedProps.searchedOffset !== prevMergedProps.searchedOffset) {
        return false;
      }
      if (
        !arrayEquals(
          nextMergedProps.searchedGeneralIds,
          prevMergedProps.searchedGeneralIds
        )
      ) {
        return false;
      }
      if (
        !arrayEquals(
          nextMergedProps.deckPersonals,
          prevMergedProps.deckPersonals
        )
      ) {
        return false;
      }
      return true;
    },
  }
)(CardList);
