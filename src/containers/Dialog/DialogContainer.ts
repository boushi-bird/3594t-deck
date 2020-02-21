import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import { dialogActions, DialogState } from '../../modules/dialog';
import { State } from '../../store';
import Dialog, { StateFromProps, DispatchFromProps, Props } from './Dialog';

interface ContainerDispatchFromProps {
  closeDialog: () => void;
}

type OwnProps = {};

type TMapStateToProps = MapStateToProps<DialogState, OwnProps, State>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  DialogState,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = state => state.dialogReducer;

const mapDispatchToProps: TMapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeDialog: dialogActions.closeDialog,
    },
    dispatch
  );

const mergeProps: TMergeProps = (state, actions) => {
  const { actionRed, actionBlue, actionCancel, ...otherState } = state;
  const sProps: StateFromProps = otherState;
  const dProps: DispatchFromProps = {
    actionRed: () => {
      actionRed();
      actions.closeDialog();
    },
    actionBlue: () => {
      actionBlue();
      actions.closeDialog();
    },
    actionCancel: () => {
      if (actionCancel) {
        actionCancel();
      }
      actions.closeDialog();
    },
  };
  return {
    ...sProps,
    ...dProps,
  };
};

export default connect<
  DialogState,
  ContainerDispatchFromProps,
  OwnProps,
  StateFromProps & DispatchFromProps
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(Dialog);
