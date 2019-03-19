import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { windowActions } from '../../modules/window';
import { datalistActions } from '../../modules/datalist';
import { deckActions } from '../../modules/deck';
import { State } from '../../store';
import App, { StateFromProps, DispatchFromProps } from './App';
import { loadFromApi } from '../../services/loadData';

interface ContainerStateFromProps extends StateFromProps {
  activeIndex?: number;
}

export default connect<
  ContainerStateFromProps,
  DispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => ({
    ...state.windowReducer,
    openedAnyModal:
      state.windowReducer.openedFilter || !state.windowReducer.ready,
    loading: !state.windowReducer.ready,
    activeIndex: state.deckReducer.activeIndex,
  }),
  (dispatch: Dispatch) => ({
    fetchBaseData: async (): Promise<void> => {
      // TODO APIからかLocalからか選択してデータ取得させる
      const baseData = await loadFromApi();
      dispatch(datalistActions.setBaseData(baseData));
      dispatch(windowActions.beReady());
    },
    ...bindActionCreators(
      {
        clearActiveCard: deckActions.clearActiveCard,
        resetConditions: datalistActions.resetConditions,
        ...windowActions,
      },
      dispatch
    ),
  }),
  (state, actions) => {
    const { activeIndex, ...otherState } = state;
    return {
      ...otherState,
      ...actions,
      clearActiveCard: () => {
        if (activeIndex !== undefined) {
          actions.clearActiveCard();
        }
      },
    };
  },
  {
    areMergedPropsEqual: () => false,
  }
)(App);
