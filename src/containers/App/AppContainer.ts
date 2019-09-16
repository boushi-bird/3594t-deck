import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { forceCheck } from 'react-lazyload';
import { windowActions } from '../../modules/window';
import { datalistActions } from '../../modules/datalist';
import { deckActions } from '../../modules/deck/reducer';
import { State } from '../../store';
import App, { StateFromProps, DispatchFromProps, OwnProps } from './App';
import { loadFromApi } from '../../services/loadData';

interface ContainerStateFromProps extends StateFromProps {
  activeIndex?: number;
}

export default connect<
  ContainerStateFromProps,
  DispatchFromProps,
  OwnProps,
  StateFromProps & DispatchFromProps
>(
  (state: State) => ({
    ...state.windowReducer,
    openedAnyModal:
      state.windowReducer.openedDeckConfig || !state.windowReducer.ready,
    openedAnyModalSmall:
      state.windowReducer.openedFilter || !state.windowReducer.ready,
    loading: !state.windowReducer.ready,
    activeIndex: state.deckReducer.activeIndex,
  }),
  (dispatch: Dispatch) => {
    const actions = bindActionCreators(
      {
        setBaseData: datalistActions.setBaseData,
        beReady: windowActions.beReady,
      },
      dispatch
    );
    return {
      appDidLoaded: async (): Promise<void> => {
        const baseData = await loadFromApi();
        // TODO APIからかLocalからか選択してデータ取得させる
        actions.setBaseData(baseData);
        actions.beReady();
        forceCheck();
      },
      ...bindActionCreators(
        {
          clearActiveCard: deckActions.clearActiveCard,
          resetConditions: datalistActions.resetConditions,
          ...windowActions,
        },
        dispatch
      ),
    };
  },
  (state, actions, ownProps) => {
    const { activeIndex, ...otherState } = state;
    return {
      ...otherState,
      ...actions,
      ...ownProps,
      clearActiveCard: () => {
        if (activeIndex !== undefined) {
          actions.clearActiveCard();
        }
      },
      closeSideMenu: () => {
        if (otherState.openedSideMenu) {
          actions.closeSideMenu();
        }
      },
    };
  },
  {
    areMergedPropsEqual: () => false,
  }
)(App);
