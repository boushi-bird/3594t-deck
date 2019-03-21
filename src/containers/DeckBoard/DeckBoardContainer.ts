import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import {
  deckActions,
  DeckState,
  DeckCard as DeckCardDummy,
} from '../../modules/deck';
import { State } from '../../store';
import DeckBoard, {
  StateFromProps,
  DispatchFromProps,
  DeckCardGeneral,
} from './DeckBoard';

type General = State['datalistReducer']['generals'][number];
type FilterCondition = State['datalistReducer']['filterCondition'];

interface ContainerStateFromProps {
  deckState: DeckState;
  generals: General[];
  costs: FilterCondition['costs'];
  belongStates: FilterCondition['belongStates'];
  unitTypes: FilterCondition['unitTypes'];
}

interface ContainerDispatchFromProps
  extends Pick<
    DispatchFromProps,
    Exclude<keyof DispatchFromProps, 'addDeckDummy'>
  > {
  rawAddDeckDummy: typeof deckActions['addDeckDummy'];
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
    belongStates: state.datalistReducer.filterCondition.belongStates,
    costs: state.datalistReducer.filterCondition.costs,
    unitTypes: state.datalistReducer.filterCondition.unitTypes,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        selectMainGen: deckActions.selectMainGen,
        setActiveCard: deckActions.setActiveCard,
        removeDeck: deckActions.removeDeck,
        rawAddDeckDummy: deckActions.addDeckDummy,
      },
      dispatch
    ),
  (state, actions) => {
    const { deckState, generals, costs, belongStates, unitTypes } = state;
    const { activeIndex, enableSearch } = deckState;
    const { rawAddDeckDummy, ...otherActions } = actions;
    let totalForce = 0;
    let totalIntelligence = 0;
    let totalConquest = 0;
    let totalCost = 0;
    let hasDummy = false;
    const deckCards: (DeckCardGeneral | DeckCardDummy)[] = [];
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
        deckCards.push({
          general,
          genMain: deckCard.genMain,
        });
      } else {
        hasDummy = true;
        cost = deckCard.cost;
        deckCards.push(deckCard);
      }
      totalCost += parseInt(cost) / 10;
    });
    return {
      deckCards,
      activeIndex,
      enableSearch,
      generals,
      totalForce,
      totalIntelligence,
      totalConquest,
      totalCost,
      limitCost: 8,
      hasDummy,
      ...otherActions,
      addDeckDummy: () => {
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
    };
  },
  {
    areMergedPropsEqual: () => false,
  }
)(DeckBoard);
