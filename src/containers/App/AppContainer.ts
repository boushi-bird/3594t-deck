import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import { forceCheck } from 'react-lazyload';
import { windowActions } from '../../modules/window';
import { datalistActions } from '../../modules/datalist';
import { deckActions } from '../../modules/deck';
import querySync from '../../modules/querySync';
import { State } from '../../store';
import App, { StateFromProps, DispatchFromProps, OwnProps, Props } from './App';
import { loadFromApi } from '../../services/loadData';

interface ContainerStateFromProps extends StateFromProps {
  activeIndex: number | null;
}

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

const mapStateToProps: TMapStateToProps = state => ({
  ...state.windowReducer,
  openedAnyModal:
    state.windowReducer.openedDeckConfig ||
    state.windowReducer.openedUpdateInfo ||
    !!state.windowReducer.detailGeneral ||
    !state.windowReducer.ready,
  openedAnyModalSmall:
    state.windowReducer.openedFilter || !state.windowReducer.ready,
  loading: !state.windowReducer.ready,
  activeIndex: state.deckReducer.activeIndex,
  searchMode: state.datalistReducer.effectiveFilterCondition.basic.searchMode,
  deckSelected:
    state.deckReducer.activeIndex != null ||
    state.deckReducer.activeAssistIndex != null,
});

const mapDispatchToProps: TMapDispatchToProps = dispatch => {
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
        ...windowActions,
      },
      dispatch
    ),
  };
};

const mergeProps: TMergeProps = (state, actions, ownProps) => {
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
};

export default connect<
  ContainerStateFromProps,
  DispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(App);
