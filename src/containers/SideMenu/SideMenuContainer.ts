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
  installPromptEvent: BeforeInstallPromptEvent | null;
}

interface ContainerDispatchFromProps {
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

const mapStateToProps: TMapStateToProps = state => ({
  installPromptEvent: state.windowReducer.installPromptEvent,
});

const mapDispatchToProps: TMapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      storeInstallPromptEvent: windowActions.storeInstallPromptEvent,
    },
    dispatch
  );

const mergeProps: TMergeProps = (state, actions) => {
  const sProps: StateFromProps = {
    pwaInstallEnabled: !!state.installPromptEvent,
  };
  const dProps: DispatchFromProps = {
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
>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  { areMergedPropsEqual: () => false }
)(SideMenu);
