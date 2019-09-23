import { ActionType, createAction } from 'typesafe-actions';

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
  activeFilter: FilterTab;
  installPromptEvent: BeforeInstallPromptEvent | null;
}

export const windowActions = {
  beReady: createAction('BE_READY'),
  openSideMenu: createAction('CHANGE_SIDEMENU_VISIBLE', action => () =>
    action({ openedSideMenu: true })
  ),
  closeSideMenu: createAction('CHANGE_SIDEMENU_VISIBLE', action => () =>
    action({ openedSideMenu: false })
  ),
  openFilter: createAction('CHANGE_FILTER_VISIBLE', action => () =>
    action({ openedFilter: true })
  ),
  closeFilter: createAction('CHANGE_FILTER_VISIBLE', action => () =>
    action({ openedFilter: false })
  ),
  openDeckConfig: createAction('CHANGE_DECK_CONFIG_VISIBLE', action => () =>
    action({ openedDeckConfig: true })
  ),
  closeDeckConfig: createAction('CHANGE_DECK_CONFIG_VISIBLE', action => () =>
    action({ openedDeckConfig: false })
  ),
  closeAllModal: createAction('CLOSE_ALL_MODAL'),
  changeActiveFilterTab: createAction(
    'CHANGE_ACTIVE_FILTER',
    action => (activeFilter: FilterTab) => action({ activeFilter })
  ),
  storeInstallPromptEvent: createAction(
    'STORE_INSTALL_PROMPT_EVENT',
    action => (event: BeforeInstallPromptEvent | null) => action({ event })
  ),
};

const initialState: WindowState = {
  ready: false,
  openedSideMenu: false,
  openedFilter: false,
  openedDeckConfig: false,
  activeFilter: 'BASIC',
  installPromptEvent: null,
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
    case 'CLOSE_ALL_MODAL':
      return {
        ...state,
        openedFilter: false,
        openedDeckConfig: false,
      };
    case 'CHANGE_ACTIVE_FILTER':
      const {
        payload: { activeFilter },
      } = actions;
      return {
        ...state,
        activeFilter,
      };
    case 'STORE_INSTALL_PROMPT_EVENT':
      const {
        payload: { event },
      } = actions;
      return {
        ...state,
        installPromptEvent: event,
      };
    default:
      return state;
  }
}
