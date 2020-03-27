import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  Options,
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import { General, AssistGeneral, FilterContents } from '3594t-deck';
import { MAX_MORALE_LIMIT, CHARM_MORALE, GEN_MAIN_MORALE } from '../../const';
import { datalistActions } from '../../modules/datalist';
import { deckActions, DeckCard, DeckCardAssist } from '../../modules/deck';
import { windowActions } from '../../modules/window';
import { dialogActions, DialogInfo } from '../../modules/dialog';
import store, { State } from '../../store';
import DeckBoard, {
  StateFromProps,
  DispatchFromProps,
  DeckCardInfo,
  DeckCardAssistInfo,
  Props,
} from './DeckBoard';
import isEnabledAddDeck from '../Common/isEnabledAddDeck';

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

const mapStateToProps: TMapStateToProps = state => ({
  deckCards: state.deckReducer.deckCards,
  assistDeckCards: state.deckReducer.assistDeckCards,
  enableSearch: state.deckReducer.searchCondition != null,
  activeIndex: state.deckReducer.activeIndex,
  activeAssistIndex: state.deckReducer.activeAssistIndex,
  generals: state.datalistReducer.generals,
  assistGenerals: state.datalistReducer.assistGenerals,
  filterContents: state.datalistReducer.filterContents,
  limitCost: state.deckReducer.deckConstraints.limitCost,
  assistCardLimit: state.deckReducer.deckConstraints.assistCardLimit,
});

const mapDispatchToProps: TMapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      openDeckConfig: windowActions.openDeckConfig,
      selectMainGen: deckActions.selectMainGen,
      setActiveCard: deckActions.setActiveCard,
      removeDeck: deckActions.removeDeck,
      rawAddDeckDummy: deckActions.addDeckDummy,
      setActiveAssistCard: deckActions.setActiveAssistCard,
      removeDeckAssist: deckActions.removeDeckAssist,
      clearDeck: deckActions.clearDeck,
      searchByDeck: deckActions.searchByDeck,
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
  let hasDummy = false;
  let hasStateDummy = false;
  const deckCards: DeckCardInfo[] = [];
  const assistDeckCards: DeckCardAssistInfo[] = [];
  const belongStateSet = new Set<string>();
  const genMainCounts = new Map<string, number>();
  const skillCounts = new Map<string, number>();
  rawDeckCards.forEach(deckCard => {
    let cost: string;
    if ('general' in deckCard) {
      const general =
        deckCard.general != null
          ? generals.find(g => g.id === deckCard.general)
          : undefined;
      if (!general) {
        return;
      }
      totalForce += general.force;
      totalIntelligence += general.intelligence;
      totalConquest += general.conquest;
      cost = general.raw.cost;
      belongStateSet.add(general.raw.state);
      const genMain = deckCard.genMain;
      if (genMain != null) {
        const gm = general.genMains.find(g => g.id === genMain);
        if (gm) {
          const count = genMainCounts.get(gm.name) || 0;
          genMainCounts.set(gm.name, count + 1);
        }
      }
      general.skills.forEach(s => {
        const count = skillCounts.get(s.name) || 0;
        skillCounts.set(s.name, count + 1);
      });
      deckCards.push({
        general,
        genMain,
        pocket: deckCard.pocket,
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
  rawAssistDeckCards.forEach(({ assist: id }) => {
    const assist = assistGenerals.find(a => a.id === id);
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

  // 将器による加算

  const allyCount = genMainCounts.get('同盟者') || 0;
  let maxMoraleByMainGen = allyCount * 2;
  if (maxMorale + maxMoraleByMainGen >= MAX_MORALE_LIMIT) {
    maxMoraleByMainGen = MAX_MORALE_LIMIT - maxMorale;
    maxMorale = MAX_MORALE_LIMIT;
  } else {
    maxMorale += maxMoraleByMainGen;
  }

  const moraleCount = genMainCounts.get('士気上昇') || 0;
  const tolalMoraleByMainGen = moraleCount * GEN_MAIN_MORALE;

  const wiseCount = genMainCounts.get('知力上昇') || 0;
  const intelligenceByMainGen = wiseCount * 3;
  totalIntelligence += intelligenceByMainGen;

  const conquestCount = genMainCounts.get('征圧力上昇') || 0;
  const conquestByMainGen = conquestCount * 1;
  totalConquest += conquestByMainGen;

  const sProps: StateFromProps = {
    deckCards,
    assistDeckCards,
    activeIndex,
    activeAssistIndex,
    enabledAddDeck,
    enableSearch,
    totalForce,
    totalIntelligence,
    intelligenceByMainGen,
    totalConquest,
    conquestByMainGen,
    conquestRank,
    totalCost,
    limitCost,
    maxMorale,
    maxMoraleByMainGen,
    tolalMoraleByCharm,
    tolalMoraleByMainGen,
    hasDummy,
    hasStateDummy,
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
      } = store.getState().datalistReducer.filterCondition.basic;
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
          message: 'デッキをクリアします。',
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
