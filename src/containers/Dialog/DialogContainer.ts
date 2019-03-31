import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { dialogActions, DialogState } from '../../modules/dialog';
import { State } from '../../store';
import Dialog, { StateFromProps, DispatchFromProps } from './Dialog';

interface ContainerDispatchFromProps {
  closeDialog: () => void;
}

export default connect<
  DialogState,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => state.dialogReducer,
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        closeDialog: dialogActions.closeDialog,
      },
      dispatch
    ),
  (state, actions) => {
    const { actionRed, actionBlue, actionCancel, ...otherState } = state;
    return {
      ...otherState,
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
  },
  { areMergedPropsEqual: () => false }
)(Dialog);
