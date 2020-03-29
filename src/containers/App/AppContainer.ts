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
import { dialogActions } from '../../modules/dialog';
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
  ...state.windowReducer,
  openedAnyModal:
    state.windowReducer.openedDeckConfig ||
    state.windowReducer.openedUpdateInfo ||
    !!state.windowReducer.detailGeneral ||
    !state.windowReducer.ready,
  openedAnyModalSmall:
    state.windowReducer.openedFilter || !state.windowReducer.ready,
  loading: !state.windowReducer.ready,
  deckSelected:
    state.deckReducer.activeIndex != null ||
    state.deckReducer.activeAssistIndex != null,
});

interface PoisonGeneral {
  code: string;
  avatar: string;
  name: string;
  title: string;
  message: string;
}

const POISON_GENERALS: PoisonGeneral[] = [
  {
    code: '6b66d077b9d057234c9e8c1a834618a7',
    avatar: 'd7b7bd42a8cd121ed594fbc8ced24dbb',
    name: '李儒',
    title: '滅国の毒牙',
    message: '怨嗟の声と絶望の涙を搾り取れ！',
  },
];

function poisonGeneral(): PoisonGeneral {
  return POISON_GENERALS[0];
}

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  const actions = bindActionCreators(
    {
      setBaseData: datalistActions.setBaseData,
      beReady: windowActions.beReady,
      showDialog: dialogActions.showDialog,
      enableAprilFool: windowActions.enableAprilFool,
    },
    dispatch
  );
  return {
    appDidLoaded: async (): Promise<void> => {
      const baseData = await loadFromApi();
      // TODO APIからかLocalからか選択してデータ取得させる
      actions.setBaseData(baseData);
      querySync();
      if (window.__aprilFool) {
        // エイプリールフールネタ発動
        const { code, avatar, name, title, message } = poisonGeneral();
        actions.showDialog({
          title,
          message,
          redText: '反計可能！',
          actionRed: () => {
            actions.beReady();
            forceCheck();
            setTimeout(forceCheck, 1000);
          },
          blueText: '何もしない',
          actionBlue: () => {
            actions.enableAprilFool({ code, name, avatar });
            actions.beReady();
            forceCheck();
            setTimeout(forceCheck, 1000);
          },
          cancelable: false,
          animation: false,
          poisonAnimationIfBlue: true,
        });
      } else {
        actions.beReady();
      }
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
