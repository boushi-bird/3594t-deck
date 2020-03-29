import type { ActionType } from 'typesafe-actions';
import { createAction } from 'typesafe-actions';
import type { General, AssistGeneral, AprilFoolGeneral } from '3594t-deck';

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
  detailGeneral?: General;
  detailAssistGeneral?: AssistGeneral;
  installPromptEvent: BeforeInstallPromptEvent | null;
  aprilFoolGeneral: AprilFoolGeneral | null;
}

export const windowActions = {
  beReady: createAction('BE_READY')(),
  openSideMenu: createAction('CHANGE_SIDEMENU_VISIBLE', () => ({
    openedSideMenu: true,
  }))(),
  closeSideMenu: createAction('CHANGE_SIDEMENU_VISIBLE', () => ({
    openedSideMenu: false,
  }))(),
  openFilter: createAction('CHANGE_FILTER_VISIBLE', () => ({
    openedFilter: true,
  }))(),
  closeFilter: createAction('CHANGE_FILTER_VISIBLE', () => ({
    openedFilter: false,
  }))(),
  openDeckConfig: createAction('CHANGE_DECK_CONFIG_VISIBLE', () => ({
    openedDeckConfig: true,
  }))(),
  closeDeckConfig: createAction('CHANGE_DECK_CONFIG_VISIBLE', () => ({
    openedDeckConfig: false,
  }))(),
  openUpdateInfo: createAction('CHANGE_UPDATE_INFO_VISIBLE', () => ({
    openedUpdateInfo: true,
  }))(),
  closeUpdateInfo: createAction('CHANGE_UPDATE_INFO_VISIBLE', () => ({
    openedUpdateInfo: false,
  }))(),
  enableNotice: createAction('CHANGE_SHOW_NOTICE', () => ({
    showNotice: true,
  }))(),
  disableNotice: createAction('CHANGE_SHOW_NOTICE', () => ({
    showNotice: false,
  }))(),
  openGeneralDetail: createAction(
    'CHANGE_GENERAL_DETAIL',
    (general: General) => ({ detailGeneral: general })
  )(),
  openAssistGeneralDetail: createAction(
    'CHANGE_ASSIST_GENERAL_DETAIL',
    (assistGeneral: AssistGeneral) => ({ detailAssistGeneral: assistGeneral })
  )(),
  closeAllModal: createAction('CLOSE_ALL_MODAL')(),
  changeActiveFilterTab: createAction(
    'CHANGE_ACTIVE_FILTER',
    (activeFilter: FilterTab) => ({ activeFilter })
  )(),
  storeInstallPromptEvent: createAction(
    'STORE_INSTALL_PROMPT_EVENT',
    (event: BeforeInstallPromptEvent | null) => ({ event })
  )(),
  enableAprilFool: createAction(
    'CHANGE_APRIL_FOOL',
    (aprilFoolGeneral: AprilFoolGeneral) => ({
      aprilFoolGeneral,
    })
  )(),
  disableAprilFool: createAction('CHANGE_APRIL_FOOL', () => ({
    aprilFoolGeneral: null,
  }))(),
};

const initialState: WindowState = {
  ready: false,
  openedSideMenu: false,
  openedFilter: false,
  openedDeckConfig: false,
  openedUpdateInfo: false,
  showNotice: false,
  activeFilter: 'BASIC',
  detailGeneral: undefined,
  installPromptEvent: null,
  aprilFoolGeneral: null,
};

export default function windowReducer(
  state: WindowState = initialState,
  actions: ActionType<typeof windowActions>
): WindowState {
  switch (actions.type) {
    case 'BE_READY':
      return {
        ...state,
        ready: true,
      };
    case 'CHANGE_SIDEMENU_VISIBLE':
      const {
        payload: { openedSideMenu },
      } = actions;
      return {
        ...state,
        openedSideMenu,
      };
    case 'CHANGE_FILTER_VISIBLE':
      const {
        payload: { openedFilter },
      } = actions;
      return {
        ...state,
        openedFilter,
      };
    case 'CHANGE_DECK_CONFIG_VISIBLE':
      const {
        payload: { openedDeckConfig },
      } = actions;
      return {
        ...state,
        openedDeckConfig,
      };
    case 'CHANGE_UPDATE_INFO_VISIBLE':
      const {
        payload: { openedUpdateInfo },
      } = actions;
      return {
        ...state,
        openedUpdateInfo,
      };
    case 'CLOSE_ALL_MODAL':
      return {
        ...state,
        openedFilter: false,
        openedDeckConfig: false,
        openedUpdateInfo: false,
        detailGeneral: undefined,
        detailAssistGeneral: undefined,
      };
    case 'CHANGE_ACTIVE_FILTER':
      const {
        payload: { activeFilter },
      } = actions;
      return {
        ...state,
        activeFilter,
      };
    case 'CHANGE_SHOW_NOTICE':
      const {
        payload: { showNotice },
      } = actions;
      return {
        ...state,
        showNotice,
      };
    case 'CHANGE_GENERAL_DETAIL':
      const {
        payload: { detailGeneral },
      } = actions;
      return {
        ...state,
        detailGeneral,
      };
    case 'CHANGE_ASSIST_GENERAL_DETAIL':
      const {
        payload: { detailAssistGeneral },
      } = actions;
      return {
        ...state,
        detailAssistGeneral,
      };
    case 'STORE_INSTALL_PROMPT_EVENT':
      const {
        payload: { event },
      } = actions;
      return {
        ...state,
        installPromptEvent: event,
      };
    case 'CHANGE_APRIL_FOOL': {
      const { aprilFoolGeneral } = actions.payload;
      return {
        ...state,
        aprilFoolGeneral,
      };
    }
    default:
      return state;
  }
}
