import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { datalistActions } from '../../modules/datalist';
import { windowActions } from '../../modules/window';
import { State } from '../../store';
import DeckConfig, { StateFromProps, DispatchFromProps } from './DeckConfig';

export default connect<StateFromProps, DispatchFromProps>(
  (state: State) => ({
    show: state.windowReducer.openedDeckConfig,
    ...state.datalistReducer.deckConstraints,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        closeDeckConfig: windowActions.closeDeckConfig,
        setDeckConstraints: datalistActions.setDeckConstraints,
      },
      dispatch
    )
)(DeckConfig);
