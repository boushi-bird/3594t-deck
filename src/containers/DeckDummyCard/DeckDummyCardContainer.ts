import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { deckActions } from '../../modules/deck';
import { State } from '../../store';
import DeckDummyCard, {
  OwnProps,
  StateFromProps,
  DispatchFromProps,
} from './DeckDummyCard';

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  (state: State) => ({
    belongStates: state.datalistReducer.filterContents.belongStates,
    costs: state.datalistReducer.filterContents.costs,
    unitTypes: state.datalistReducer.filterContents.unitTypes,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        setActiveCard: deckActions.setActiveCard,
        setDeckValue: deckActions.setDeckValue,
        removeDeck: deckActions.removeDeck,
      },
      dispatch
    )
)(DeckDummyCard);
