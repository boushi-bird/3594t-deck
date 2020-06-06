import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { General, AssistGeneral } from '3594t-deck';

export const filterTabNames = {
  BASIC: '基本',
  DETAIL: '詳細',
  STRAT: '計略',
};

export type FilterTab = keyof typeof filterTabNames;

export interface WindowState {
  ready: boolean;
  openedSideMenu: boolean;
  openedFilter: boolean;
  openedDeckConfig: boolean;
  openedUpdateInfo: boolean;
  showNotice: boolean;
  activeFilter: FilterTab;
  detailGeneral: General | null;
  detailAssistGeneral: AssistGeneral | null;
  installPromptEvent: BeforeInstallPromptEvent | null;
}

const initialState: WindowState = {
  ready: false,
  openedSideMenu: false,
  openedFilter: false,
  openedDeckConfig: false,
  openedUpdateInfo: false,
  showNotice: false,
  activeFilter: 'BASIC',
  detailGeneral: null,
  detailAssistGeneral: null,
  installPromptEvent: null,
};

export const windowModule = createSlice({
  name: 'window',
  initialState,
  reducers: {
    beReady(state: WindowState): WindowState {
      return {
        ...state,
        ready: true,
      };
    },
    changeSideMenuVisible(
      state: WindowState,
      action: PayloadAction<{ openedSideMenu: boolean }>
    ): WindowState {
      const {
        payload: { openedSideMenu },
      } = action;
      return {
        ...state,
        openedSideMenu,
      };
    },
    changeFilterVisible(
      state: WindowState,
      action: PayloadAction<{ openedFilter: boolean }>
    ): WindowState {
      const {
        payload: { openedFilter },
      } = action;
      return {
        ...state,
        openedFilter,
      };
    },
    changeDeckConfigVisible(
      state: WindowState,
      action: PayloadAction<{ openedDeckConfig: boolean }>
    ): WindowState {
      const {
        payload: { openedDeckConfig },
      } = action;
      return {
        ...state,
        openedDeckConfig,
      };
    },
    changeUpdateInfoVisible(
      state: WindowState,
      action: PayloadAction<{ openedUpdateInfo: boolean }>
    ): WindowState {
      const {
        payload: { openedUpdateInfo },
      } = action;
      return {
        ...state,
        openedUpdateInfo,
      };
    },
    closeAllModal(state: WindowState): WindowState {
      return {
        ...state,
        openedFilter: false,
        openedDeckConfig: false,
        openedUpdateInfo: false,
        detailGeneral: null,
        detailAssistGeneral: null,
      };
    },
    changeActiveFilterTab(
      state: WindowState,
      action: PayloadAction<FilterTab>
    ): WindowState {
      return {
        ...state,
        activeFilter: action.payload,
      };
    },
    changeShowNotice(
      state: WindowState,
      action: PayloadAction<{ showNotice: boolean }>
    ): WindowState {
      const {
        payload: { showNotice },
      } = action;
      return {
        ...state,
        showNotice,
      };
    },
    openGeneralDetail(
      state: WindowState,
      action: PayloadAction<General>
    ): WindowState {
      return {
        ...state,
        detailGeneral: action.payload,
      };
    },
    openAssistGeneralDetail(
      state: WindowState,
      action: PayloadAction<AssistGeneral>
    ): WindowState {
      return {
        ...state,
        detailAssistGeneral: action.payload,
      };
    },
    storeInstallPromptEvent(
      state: WindowState,
      action: PayloadAction<BeforeInstallPromptEvent | null>
    ): WindowState {
      return {
        ...state,
        installPromptEvent: action.payload,
      };
    },
  },
});

export const windowActions = windowModule.actions;
