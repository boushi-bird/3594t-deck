import type { ActionType } from 'typesafe-actions';
import { createAction } from 'typesafe-actions';

export interface DialogInfo {
  title: string;
  message: string;
  logoUrl?: string;
  redText: string;
  blueText: string;
  cancelable?: boolean;
  animation?: boolean;
  actionRed: () => void;
  actionBlue: () => void;
  actionCancel?: () => void;
}

export interface DialogState extends DialogInfo {
  show: boolean;
  cancelable: boolean;
  animation: boolean;
}

export const dialogActions = {
  showDialog: createAction('SHOW_DIALOG', (dialog: DialogInfo) => dialog)(),
  closeDialog: createAction('CLOSE_DIALOG')(),
};

const initialState: DialogState = {
  show: false,
  title: '',
  message: '',
  logoUrl: undefined,
  redText: '',
  blueText: '',
  cancelable: true,
  animation: true,
  actionRed: () => {},
  actionBlue: () => {},
  actionCancel: undefined,
};

export default function windowReducer(
  state: DialogState = initialState,
  actions: ActionType<typeof dialogActions>
): DialogState {
  switch (actions.type) {
    case 'SHOW_DIALOG': {
      const { cancelable, animation, ...otherSate } = actions.payload;
      return {
        ...otherSate,
        show: true,
        cancelable: cancelable != null ? cancelable : true,
        animation: animation != null ? animation : true,
      };
    }
    case 'CLOSE_DIALOG': {
      return initialState;
    }
    default:
      return state;
  }
}
