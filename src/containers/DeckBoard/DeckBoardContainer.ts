import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { datalistActions, BasicFilterCondition } from '../../modules/datalist';
import { deckActions, DeckState } from '../../modules/deck';
import { windowActions } from '../../modules/window';
import { dialogActions } from '../../modules/dialog';
import { General } from '../../services/mapBaseData';
import { State } from '../../store';
import DeckBoard, {
  StateFromProps,
  DispatchFromProps,
  DeckCardInfo,
} from './DeckBoard';
import isEnabledAddDeck from '../Common/isEnabledAddDeck';

interface ContainerStateFromProps {
  deckState: DeckState;
  generals: General[];
  costs: BasicFilterCondition['costs'];
  belongStates: BasicFilterCondition['belongStates'];
  unitTypes: BasicFilterCondition['unitTypes'];
  limitCost: number;
}

interface ContainerDispatchFromProps
  extends Omit<DispatchFromProps, 'addDeckDummy' | 'toggleSearch'> {
  rawAddDeckDummy: typeof deckActions['addDeckDummy'];
  resetPage: () => void;
  searchByDeck: (index: number) => void;
}

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => ({
    deckState: state.deckReducer,
    generals: state.datalistReducer.generals,
    belongStates: state.datalistReducer.filterCondition.basic.belongStates,
    costs: state.datalistReducer.filterCondition.basic.costs,
    unitTypes: state.datalistReducer.filterCondition.basic.unitTypes,
    limitCost: state.datalistReducer.deckConstraints.limitCost,
  }),
  (dispatch: Dispatch) => {
    const actions = bindActionCreators(
      {
        clearDeck: deckActions.clearDeck,
        showDialog: dialogActions.showDialog,
        openDeckConfig: windowActions.openDeckConfig,
      },
      dispatch
    );
    return {
      clearDeck: () => {
        actions.showDialog({
          title: 'デッキクリア',
          message: 'デッキをクリアします。',
          redText: 'クリア',
          actionRed: () => {
            actions.clearDeck();
          },
          blueText: 'キャンセル',
          actionBlue: () => {},
        });
      },
      openDeckConfig: actions.openDeckConfig,
      ...bindActionCreators(
        {
          selectMainGen: deckActions.selectMainGen,
          setActiveCard: deckActions.setActiveCard,
          removeDeck: deckActions.removeDeck,
          rawAddDeckDummy: deckActions.addDeckDummy,
          searchByDeck: deckActions.searchByDeck,
          resetPage: datalistActions.resetPage,
        },
        dispatch
      ),
    };
  },
  (state, actions) => {
    const {
      deckState,
      generals,
      costs,
      belongStates,
      unitTypes,
      limitCost,
    } = state;
    const { activeIndex, enableSearch } = deckState;
    const {
      rawAddDeckDummy,
      resetPage,
      searchByDeck,
      clearDeck,
      ...otherActions
    } = actions;
    const enabledAddDeck = isEnabledAddDeck(deckState.deckCards);
    let totalForce = 0;
    let totalIntelligence = 0;
    let totalConquest = 0;
    let totalCost = 0;
    let hasDummy = false;
    let hasStateDummy = false;
    const deckCards: DeckCardInfo[] = [];
    const belongStateSet = new Set<string>();
    const genMainCounts = new Map<string, number>();
    const skillCounts = new Map<string, number>();
    deckState.deckCards.forEach(deckCard => {
      const general =
        deckCard.general != null
          ? generals.find(g => g.id === deckCard.general)
          : undefined;
      let cost: string;
      if (general) {
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
    // 最大士気
    const stateCount = belongStateSet.size + (hasStateDummy ? 1 : 0);
    let maxMorale;
    if (stateCount === 1) {
      maxMorale = 12;
    } else if (stateCount === 2) {
      maxMorale = 9;
    } else {
      hasStateDummy = false;
      maxMorale = 6;
    }
    // 魅力による士気
    const charmCount = skillCounts.get('魅力') || 0;
    const tolalMoraleByCharm = charmCount * 40;
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
    if (maxMorale + maxMoraleByMainGen >= 12) {
      maxMoraleByMainGen = 12 - maxMorale;
      maxMorale = 12;
    } else {
      maxMorale += maxMoraleByMainGen;
    }

    const moraleCount = genMainCounts.get('士気上昇') || 0;
    const tolalMoraleByMainGen = moraleCount * 40;

    const wiseCount = genMainCounts.get('知力上昇') || 0;
    const intelligenceByMainGen = wiseCount * 3;
    totalIntelligence += intelligenceByMainGen;

    const conquestCount = genMainCounts.get('征圧力上昇') || 0;
    const conquestByMainGen = conquestCount * 1;
    totalConquest += conquestByMainGen;

    return {
      deckCards,
      activeIndex,
      enabledAddDeck,
      enableSearch,
      generals,
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
      ...otherActions,
      addDeckDummy: () => {
        if (!enabledAddDeck) {
          return;
        }
        let cost = '10';
        let belongState: string | undefined;
        let unitType: string | undefined;
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
          clearDeck();
        }
      },
      toggleSearch: index => {
        resetPage();
        if (activeIndex === index && enableSearch) {
          otherActions.setActiveCard(index);
        } else {
          searchByDeck(index);
        }
      },
    };
  },
  { areMergedPropsEqual: () => false }
)(DeckBoard);
