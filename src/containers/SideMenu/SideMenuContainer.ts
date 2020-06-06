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
import SideMenu from './SideMenu';

interface ContainerStateFromProps {
  showNotice: boolean;
  installPromptEvent: BeforeInstallPromptEvent | null;
}

interface ContainerDispatchFromProps {
  openUpdateInfo: () => void;
  storeInstallPromptEvent: (event: BeforeInstallPromptEvent | null) => void;
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
  installPromptEvent: state.window.installPromptEvent,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      openUpdateInfo: () =>
        windowActions.changeUpdateInfoVisible({
          openedUpdateInfo: true,
        }),
      storeInstallPromptEvent: windowActions.storeInstallPromptEvent,
    },
    dispatch
  );

const mergeProps: TMergeProps = (state, actions) => {
  const sProps: StateFromProps = {
    showNotice: state.showNotice,
    pwaInstallEnabled: !!state.installPromptEvent,
  };
  const dProps: DispatchFromProps = {
    openUpdateInfo: actions.openUpdateInfo,
    installPrompt: async () => {
      if (state.installPromptEvent) {
        await state.installPromptEvent.prompt();
        actions.storeInstallPromptEvent(null);
      }
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
