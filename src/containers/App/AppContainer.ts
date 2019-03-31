import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { windowActions } from '../../modules/window';
import { datalistActions } from '../../modules/datalist';
import { deckActions } from '../../modules/deck';
import { dialogActions } from '../../modules/dialog';
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
    aprilFool: state.datalistReducer.aprilFool,
  }),
  (dispatch: Dispatch) => {
    const actions = bindActionCreators(
      {
        setBaseData: datalistActions.setBaseData,
        beReady: windowActions.beReady,
        showDialog: dialogActions.showDialog,
        enableAprilFool: datalistActions.enableAprilFool,
      },
      dispatch
    );
    return {
      fetchBaseData: async (): Promise<void> => {
        const baseData = await loadFromApi();
        // TODO APIからかLocalからか選択してデータ取得させる
        actions.setBaseData(baseData);
        actions.showDialog({
          title: '滅国の毒牙',
          message: '怨嗟の声と絶望の涙を搾り取れ！',
          logoUrl:
            'https://3594t.net/img/avatar/505bdbbe30651a76015eae14e79b329b.png',
          redText: '反計可能！',
          actionRed: () => {
            actions.beReady();
          },
          blueText: '毒を受ける',
          actionBlue: () => {
            actions.enableAprilFool();
            actions.beReady();
          },
          cancelable: false,
          animation: false,
        });
      },
      ...bindActionCreators(
        {
          clearActiveCard: deckActions.clearActiveCard,
          resetConditions: datalistActions.resetConditions,
          disableAprilFool: datalistActions.disableAprilFool,
          ...windowActions,
        },
        dispatch
      ),
    };
  },
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
