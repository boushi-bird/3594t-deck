import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { deckActions } from '../../modules/deck';
import { State } from '../../store';
import DeckBoard, { StateFromProps, DispatchFromProps } from './DeckBoard';

export default connect<
  State,
  { dispatch: Dispatch },
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => state,
  (dispatch: Dispatch) => ({ dispatch }),
  (state, { dispatch }) => ({
    ...state.deckReducer,
    generals: state.datalistReducer.generals,
    belongStates: state.datalistReducer.filterContents.belongStates,
    costs: state.datalistReducer.filterContents.costs,
    unitTypes: state.datalistReducer.filterContents.unitTypes,
    ...bindActionCreators(
      {
        selectMainGen: deckActions.selectMainGen,
        setActiveCard: deckActions.setActiveCard,
      },
      dispatch
    ),
    addDeckDummy: () => {
      const {
        costs,
        belongStates,
        unitTypes,
      } = state.datalistReducer.filterCondition;
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
      dispatch(deckActions.addDeckDummy({ cost, belongState, unitType }));
    },
  })
)(DeckBoard);
