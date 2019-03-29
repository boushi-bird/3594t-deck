import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { datalistActions } from '../../modules/datalist';
import { deckActions } from '../../modules/deck';
import { State } from '../../store';
import DeckDummyCard, {
  StateFromProps,
  DispatchFromProps,
} from './DeckDummyCard';

export default connect<StateFromProps, DispatchFromProps>(
  (state: State) => ({
    belongStates: state.datalistReducer.filterContents.belongStates,
    costs: state.datalistReducer.filterContents.costs,
    unitTypes: state.datalistReducer.filterContents.unitTypes,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        setDeckValue: deckActions.setDeckValue,
        removeDeck: deckActions.removeDeck,
        searchByDeck: deckActions.searchByDeck,
        resetPage: datalistActions.resetPage,
      },
      dispatch
    )
)(DeckDummyCard);
