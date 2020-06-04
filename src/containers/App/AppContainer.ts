import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { forceCheck } from 'react-lazyload';
import { windowActions } from '../../modules/window';
import { datalistActions } from '../../modules/datalist';
import { deckActions } from '../../modules/deck';
import querySync from '../../modules/querySync';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps, OwnProps, Props } from './App';
import App from './App';
import { loadFromApi } from '../../services/loadData';

type ContainerStateFromProps = StateFromProps;

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMapDispatchToProps = MapDispatchToProps<DispatchFromProps, OwnProps>;
type TMergeProps = MergeProps<
  ContainerStateFromProps,
  DispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = (state) => ({
  ...state.window,
  openedAnyModal:
    state.window.openedDeckConfig ||
    state.window.openedUpdateInfo ||
    !!state.window.detailGeneral ||
    !state.window.ready,
  openedAnyModalSmall: state.window.openedFilter || !state.window.ready,
  loading: !state.window.ready,
  deckSelected:
    state.deck.activeIndex != null || state.deck.activeAssistIndex != null,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
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
      querySync();
      actions.beReady();
      forceCheck();
    },
    ...bindActionCreators(
      {
        clearActiveCard: deckActions.clearActiveCard,
        resetConditions: datalistActions.resetConditions,
        openSideMenu: () =>
          windowActions.changeSideMenuVisible({
            openedSideMenu: true,
          }),
        closeSideMenu: () =>
          windowActions.changeSideMenuVisible({
            openedSideMenu: false,
          }),
        openFilter: () =>
          windowActions.changeFilterVisible({ openedFilter: true }),
        closeFilter: () =>
          windowActions.changeFilterVisible({ openedFilter: false }),
        closeAllModal: windowActions.closeAllModal,
        changeActiveFilterTab: windowActions.changeActiveFilterTab,
      },
      dispatch
    ),
  };
};

const mergeProps: TMergeProps = (state, actions, ownProps) => {
  return {
    ...state,
    ...actions,
    ...ownProps,
    clearActiveCard: () => {
      if (state.deckSelected) {
        actions.clearActiveCard();
      }
    },
    closeSideMenu: () => {
      if (state.openedSideMenu) {
        actions.closeSideMenu();
      }
    },
  };
};

export default connect<
  ContainerStateFromProps,
  DispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(App);
