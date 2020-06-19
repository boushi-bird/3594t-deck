import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  Options,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { General, AssistGeneral, FilterContents } from '3594t-deck';
import { MAX_MORALE_LIMIT, CHARM_MORALE } from '../../const';
import { datalistActions } from '../../modules/datalist';
import type { DeckCard, DeckCardAssist } from '../../modules/deck';
import { deckActions } from '../../modules/deck';
import { windowActions } from '../../modules/window';
import type { DialogInfo } from '../../modules/dialog';
import { dialogActions } from '../../modules/dialog';
import type { State } from '../../store';
import store from '../../store';
import type {
  StateFromProps,
  DispatchFromProps,
  DeckCardInfo,
  DeckCardAssistInfo,
  Props,
} from './DeckBoard';
import DeckBoard from './DeckBoard';
import isEnabledAddDeck from '../Common/isEnabledAddDeck';
import {
  getGenMainParams,
  getGenMainSpParams,
} from '../../services/genMainParams';

interface ContainerStateFromProps {
  deckCards: DeckCard[];
  assistDeckCards: DeckCardAssist[];
  enableSearch: boolean;
  activeIndex: number | null;
  activeAssistIndex: number | null;
  generals: General[];
  assistGenerals: AssistGeneral[];
  filterContents: FilterContents;
  limitCost: number;
  assistCardLimit: number;
  genMainAwakingLimit: number;
  genMainSpAwakingCount: number;
}

interface ContainerDispatchFromProps
  extends Omit<DispatchFromProps, 'addDeckDummy' | 'toggleSearch'> {
  rawAddDeckDummy: typeof deckActions['addDeckDummy'];
  showDialog: (dialog: DialogInfo) => void;
  searchByDeck: (
    index: number,
    condition: {
      belongState?: string;
      cost: string;
      unitType?: string;
    }
  ) => void;
  resetPage: () => void;
}

type OwnProps = {};

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;
type ConnectorOptions = Options<
  State,
  ContainerStateFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = (state) => ({
  deckCards: state.deck.deckCards,
  assistDeckCards: state.deck.assistDeckCards,
  enableSearch: state.deck.searchCondition != null,
  activeIndex: state.deck.activeIndex,
  activeAssistIndex: state.deck.activeAssistIndex,
  generals: state.datalist.generals,
  assistGenerals: state.datalist.assistGenerals,
  filterContents: state.datalist.filterContents,
  limitCost: state.deck.deckConstraints.limitCost,
  assistCardLimit: state.deck.deckConstraints.assistCardLimit,
  genMainAwakingLimit: state.deck.deckConstraints.genMainAwakingLimit,
  genMainSpAwakingCount: state.deck.deckConstraints.genMainSpAwakingCount,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      openDeckConfig: () =>
        windowActions.changeDeckConfigVisible({
          openedDeckConfig: true,
        }),
      selectGenMain: deckActions.selectGenMain,
      awakeGenMain: deckActions.awakeGenMain,
      setActiveCard: deckActions.setActiveCard,
      removeDeck: deckActions.removeDeck,
      rawAddDeckDummy: deckActions.addDeckDummy,
      setActiveAssistCard: deckActions.setActiveAssistCard,
      removeDeckAssist: deckActions.removeDeckAssist,
      clearDeck: deckActions.clearDeck,
      searchByDeck: deckActions.searchByDeck,
      showDetail: windowActions.openGeneralDetail,
      showAssistDetail: windowActions.openAssistGeneralDetail,
      moveLeft: (index: number) =>
        deckActions.moveDeckIndex({ index, direction: 'left' }),
      moveRight: (index: number) =>
        deckActions.moveDeckIndex({ index, direction: 'right' }),
      resetPage: datalistActions.resetPage,
      showDialog: dialogActions.showDialog,
    },
    dispatch
  );
};

const mergeProps: TMergeProps = (state, actions) => {
  const {
    deckCards: rawDeckCards,
    assistDeckCards: rawAssistDeckCards,
    enableSearch,
    activeIndex,
    activeAssistIndex,
    generals,
    assistGenerals,
    limitCost,
    assistCardLimit,
    genMainAwakingLimit,
    genMainSpAwakingCount,
  } = state;
  const {
    rawAddDeckDummy,
    clearDeck,
    searchByDeck,
    resetPage,
    showDialog,
    ...otherActions
  } = actions;
  const enabledAddDeck = isEnabledAddDeck(rawDeckCards);
  let totalForce = 0;
  let totalIntelligence = 0;
  let totalConquest = 0;
  let totalCost = 0;
  let tolalMoraleByGenMain = 0;
  let maxMoraleByGenMain = 0;
  let totalAwakingGenMainCount = 0;
  let hasDummy = false;
  let hasStateDummy = false;
  const deckCards: DeckCardInfo[] = [];
  const assistDeckCards: DeckCardAssistInfo[] = [];
  const belongStateSet = new Set<string>();
  const skillCounts = new Map<string, number>();
  // 所属勢力ごとの加算値
  const statesGenMainParams = new Map<
    string,
    { intelligence: number; conquest: number }
  >();
  rawDeckCards.forEach((deckCard) => {
    let cost: string;
    if ('general' in deckCard) {
      const { general: generalId, ...deckInfo } = deckCard;
      const general =
        deckCard.general != null
          ? generals.find((g) => g.id === generalId)
          : undefined;
      if (!general) {
        return;
      }
      totalForce += general.force;
      totalIntelligence += general.intelligence;
      totalConquest += general.conquest;
      cost = general.raw.cost;
      belongStateSet.add(general.raw.state);
      const genMain = deckInfo.genMain;
      // 消費する主将器ポイント 奇才将器の場合は消費ポイントが違う
      const genMainAwakingCount =
        general.genMainSp != null ? genMainSpAwakingCount : 1;
      if (deckInfo.genMainAwaking) {
        totalAwakingGenMainCount += genMainAwakingCount;
      }
      const additionalParams = {
        force: 0,
        intelligence: 0,
        conquest: 0,
      };
      if (genMain != null && deckInfo.genMainAwaking) {
        const gm = general.genMains.find((g) => g.id === genMain);
        if (gm) {
          const p =
            general.genMainSp != null
              ? getGenMainSpParams(general.genMainSp)
              : getGenMainParams(gm);
          additionalParams.intelligence += p.self.intelligence;
          additionalParams.conquest += p.self.conquest;
          for (const [state, prms] of Object.entries(p.states)) {
            const totalPrms = statesGenMainParams.get(state) || {
              intelligence: 0,
              conquest: 0,
            };
            totalPrms.intelligence += prms.intelligence;
            totalPrms.conquest += prms.conquest;
            statesGenMainParams.set(state, totalPrms);
          }
          tolalMoraleByGenMain += p.morale;
          maxMoraleByGenMain += p.maxMorale;
        }
      }
      general.skills.forEach((s) => {
        const count = skillCounts.get(s.name) || 0;
        skillCounts.set(s.name, count + 1);
      });
      deckCards.push({
        ...deckInfo,
        general,
        genMainAwakingCount,
        additionalParams,
      });
    } else {
      hasDummy = true;
      cost = deckCard.cost;
      if (deckCard.belongState) {
        belongStateSet.add(deckCard.belongState);
      } else {
        hasStateDummy = true;
      }
      deckCards.push(deckCard);
    }
    totalCost += parseInt(cost);
  });
  // 主将器の全体効果加算
  deckCards.forEach((deckCard) => {
    if (!('general' in deckCard)) {
      return;
    }
    const stateCode = deckCard.general.state.code;
    if (!stateCode) {
      return;
    }
    const p = statesGenMainParams.get(stateCode);
    if (!p) {
      return;
    }
    deckCard.additionalParams.intelligence += p.intelligence;
    deckCard.additionalParams.conquest += p.conquest;
  });
  rawAssistDeckCards.forEach(({ assist: id }) => {
    const assist = assistGenerals.find((a) => a.id === id);
    if (assist && assistDeckCards.length < assistCardLimit) {
      assistDeckCards.push({ assist });
      belongStateSet.add(assist.raw.state);
    }
  });
  // assistCardLimitの数になるまで空の遊軍設置
  if (assistDeckCards.length < assistCardLimit) {
    const fillCount = assistCardLimit - assistDeckCards.length;
    for (let index = 0; index < fillCount; index++) {
      assistDeckCards.push({ assist: null });
    }
  }
  // 最大士気
  const stateCount = belongStateSet.size + (hasStateDummy ? 1 : 0);
  let maxMorale;
  if (stateCount === 1) {
    maxMorale = MAX_MORALE_LIMIT;
  } else if (stateCount === 2) {
    maxMorale = 9;
  } else {
    hasStateDummy = false;
    maxMorale = 6;
  }
  if (maxMorale + maxMoraleByGenMain >= MAX_MORALE_LIMIT) {
    maxMoraleByGenMain = MAX_MORALE_LIMIT - maxMorale;
    maxMorale = MAX_MORALE_LIMIT;
  } else {
    maxMorale += maxMoraleByGenMain;
  }
  // 魅力による士気
  const charmCount = skillCounts.get('魅力') || 0;
  const tolalMoraleByCharm = charmCount * CHARM_MORALE;
  // 征圧ランク
  let conquestRank;
  if (totalConquest >= 11) {
    conquestRank = 'S';
  } else if (totalConquest >= 9) {
    conquestRank = 'A';
  } else if (totalConquest >= 7) {
    conquestRank = 'B';
  } else {
    conquestRank = 'C';
  }

  // 追加パラメータによる加算
  const additionalParamsByGenMain = deckCards.reduce(
    (v, deckCard) => {
      if ('additionalParams' in deckCard) {
        const p = deckCard.additionalParams;
        return {
          intelligence: v.intelligence + p.intelligence,
          conquest: v.conquest + p.conquest,
        };
      }
      return v;
    },
    { intelligence: 0, conquest: 0 }
  );
  totalIntelligence += additionalParamsByGenMain.intelligence;
  totalConquest += additionalParamsByGenMain.conquest;

  const sProps: StateFromProps = {
    deckCards,
    assistDeckCards,
    activeIndex,
    activeAssistIndex,
    enabledAddDeck,
    enableSearch,
    totalForce,
    totalIntelligence,
    intelligenceByGenMain: additionalParamsByGenMain.intelligence,
    totalConquest,
    conquestByGenMain: additionalParamsByGenMain.conquest,
    conquestRank,
    totalCost,
    limitCost,
    maxMorale,
    maxMoraleByGenMain,
    tolalMoraleByCharm,
    tolalMoraleByGenMain,
    hasDummy,
    hasStateDummy,
    totalAwakingGenMainCount,
    genMainAwakingLimit,
  };

  const dProps: DispatchFromProps = {
    ...otherActions,
    addDeckDummy: () => {
      if (!enabledAddDeck) {
        return;
      }
      let cost = '10';
      let belongState: string | undefined;
      let unitType: string | undefined;
      const {
        costs,
        belongStates,
        unitTypes,
      } = store.getState().datalist.filterCondition.basic;
      if (costs.length >= 1) {
        cost = [...costs].sort()[0];
      }
      if (belongStates.length === 1) {
        belongState = belongStates[0];
      }
      if (unitTypes.length === 1) {
        unitType = unitTypes[0];
      }
      rawAddDeckDummy({ cost, belongState, unitType });
    },
    clearDeck: () => {
      if (deckCards.length > 0) {
        showDialog({
          title: 'デッキクリア',
          message: '現在デッキに設定中のカードをすべて削除します。',
          redText: 'クリア',
          actionRed: () => {
            clearDeck();
          },
          blueText: 'キャンセル',
          actionBlue: () => {},
        });
      }
    },
    toggleSearch: (index, condition) => {
      resetPage();
      if (activeIndex === index && enableSearch) {
        otherActions.setActiveCard(index);
      } else {
        searchByDeck(index, condition);
      }
    },
  };

  return {
    ...sProps,
    ...dProps,
  };
};

const options: ConnectorOptions = {
  areMergedPropsEqual: () => false,
};

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options
)(DeckBoard);
