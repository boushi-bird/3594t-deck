import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import { windowActions } from '../../modules/window';
import { State } from '../../store';
import SideMenu, { StateFromProps, DispatchFromProps, Props } from './SideMenu';

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
  showNotice: state.windowReducer.showNotice,
  installPromptEvent: state.windowReducer.installPromptEvent,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      openUpdateInfo: windowActions.openUpdateInfo,
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
