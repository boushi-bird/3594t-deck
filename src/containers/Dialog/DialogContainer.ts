import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { DialogState } from '../../modules/dialog';
import { dialogActions } from '../../modules/dialog';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps, Props } from './Dialog';
import Dialog from './Dialog';

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

const mapStateToProps: TMapStateToProps = (state) => state.dialog;

const mapDispatchToProps: TMapDispatchToProps = (dispatch) =>
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
