import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { deckActions } from '../../modules/deck';
import { State } from '../../store';
import DeckBoard, { StateFromProps, DispatchFromProps } from './DeckBoard';

type General = State['datalistReducer']['generals'][number];
type FilterCondition = State['datalistReducer']['filterCondition'];

interface ContainerStateFromProps extends StateFromProps {
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
    ...state.deckReducer,
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
    const { costs, belongStates, unitTypes, ...otherState } = state;
    const { rawAddDeckDummy, ...otherActions } = actions;
    return {
      ...otherState,
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
