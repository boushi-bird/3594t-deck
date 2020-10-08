import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { windowActions } from '../../modules/window';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps, Props } from './SideMenu';
import unmanagedStore from '../../unmanagedStore';
import SideMenu from './SideMenu';

interface ContainerStateFromProps {
  showNotice: boolean;
  pendingInstallPromptEvent: boolean;
}

interface ContainerDispatchFromProps {
  openUpdateInfo: () => void;
  clearInstallPromptEvent: () => void;
}

type OwnProps = {};

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = (state) => ({
  showNotice: state.window.showNotice,
  pendingInstallPromptEvent: state.window.pendingInstallPromptEvent,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      openUpdateInfo: () =>
        windowActions.changeUpdateInfoVisible({
          openedUpdateInfo: true,
        }),
      clearInstallPromptEvent: windowActions.clearInstallPromptEvent,
    },
    dispatch
  );

const mergeProps: TMergeProps = (state, actions) => {
  const sProps: StateFromProps = {
    showNotice: state.showNotice,
    pwaInstallEnabled: state.pendingInstallPromptEvent,
  };
  const dProps: DispatchFromProps = {
    openUpdateInfo: actions.openUpdateInfo,
    installPrompt: async () => {
      if (
        state.pendingInstallPromptEvent &&
        unmanagedStore.installPromptEvent
      ) {
        await unmanagedStore.installPromptEvent.prompt();
      }
      actions.clearInstallPromptEvent();
    },
  };
  return {
    ...sProps,
    ...dProps,
  };
};

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(SideMenu);
