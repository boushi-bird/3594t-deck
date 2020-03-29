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
import { generalAvatarUrl } from '../../utils/externalUrl';

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
    message: '怨嗟の声と絶望の涙を搾り取れ',
  },
  {
    code: '5ace060edaade2cd458719da7feea988',
    avatar: 'b5f84b8c0dd29f226c34f2ab81b432d8',
    name: '何皇后',
    title: '美女の毒牙',
    message: 'あたしの邪魔するやつは い〜らない',
  },
  {
    code: '1a1c93eae5ce103d3ea039327d0b9aa0',
    avatar: '08f2a9f34e4ed0446d04138515b2a064',
    name: '厳氏',
    title: '甘き毒',
    message: '周りのみ〜んながあなたの敵よ',
  },
  {
    code: '100593d9b385abbe6a1b31c95170961d',
    avatar: 'c117ccc8bbdf6be963eb7b0d0b445a79',
    name: '朶思大王',
    title: '蛇蝎の秘術',
    message: '毒にまみれ のたうち回るがいい',
  },
];

function poisonGeneral(): PoisonGeneral {
  const index = Math.floor(Math.random() * POISON_GENERALS.length);
  return POISON_GENERALS[index];
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
          logoUrl: generalAvatarUrl(avatar),
          redText: '反計可能！',
          actionRed: () => {
            actions.beReady();
            forceCheck();
            setTimeout(forceCheck, 1000);
          },
          blueText: '計略を受ける',
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
