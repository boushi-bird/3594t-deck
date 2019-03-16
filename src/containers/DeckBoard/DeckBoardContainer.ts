import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { deckActions } from '../../modules/deck';
import { State } from '../../store';
import DeckBoard, { StateFromProps, DispatchFromProps } from './DeckBoard';

export default connect<StateFromProps, DispatchFromProps>(
  (state: State) => ({
    ...state.deckReducer,
    generals: state.datalistReducer.generals,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        selectMainGen: deckActions.selectMainGen,
      },
      dispatch
    )
)(DeckBoard);
