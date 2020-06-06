import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

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

export const dialogModule = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    showDialog(
      state: DialogState,
      action: PayloadAction<DialogInfo>
    ): DialogState {
      const { cancelable, animation, ...otherSate } = action.payload;
      return {
        ...otherSate,
        show: true,
        cancelable: cancelable != null ? cancelable : true,
        animation: animation != null ? animation : true,
      };
    },
    closeDialog(): DialogState {
      return initialState;
    },
  },
});

export const dialogActions = dialogModule.actions;
