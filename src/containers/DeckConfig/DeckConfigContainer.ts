import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { deckActions } from '../../modules/deck/reducer';
import { windowActions } from '../../modules/window';
import { State } from '../../store';
import DeckConfig, { StateFromProps, DispatchFromProps } from './DeckConfig';

export default connect<StateFromProps, DispatchFromProps>(
  (state: State) => ({
    show: state.windowReducer.openedDeckConfig,
    ...state.deckReducer.deckConstraints,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        closeDeckConfig: windowActions.closeDeckConfig,
        setDeckConstraints: deckActions.setDeckConstraints,
      },
      dispatch
    )
)(DeckConfig);
