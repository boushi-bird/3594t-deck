import { ActionType, createAction } from 'typesafe-actions';
import { General, Strategy, FilterContents } from '3594t-deck';
import { BaseData } from '../services/mapBaseData';
import cloneDeep from 'lodash-es/cloneDeep';

export interface BasicFilterCondition {
  /** 勢力 */
  belongStates: string[];
  /** コスト */
  costs: string[];
  /** 兵種 */
  unitTypes: string[];
  /** 武力 最小 */
  forceMin: number;
  /** 武力 最大 */
  forceMax: number;
  /** コスト比武力 使用 */
  useCostRatioForce: boolean;
  /** コスト比武力 最小 */
  costRatioForceMin: number;
  /** コスト比武力 最大 */
  costRatioForceMax: number;
  /** コスト比 基準武力 */
  costRatioBaseForces: { [key: string]: number };
  /** 知力 最小 */
  intelligenceMin: number;
  /** 知力 最大 */
  intelligenceMax: number;
  /** 征圧力 最小 */
  conquestMin: number;
  /** 征圧力 最大 */
  conquestMax: number;
  /** 特技 */
  skills: string[];
  /** 特技 And条件 */
  skillsAnd: boolean;
  /** 検索ワード */
  searchText: string;
}

export interface DetailFilterCondition {
  /** 主将器 */
  genMains: string[];
  /** 主将器 And条件 */
  genMainsAnd: boolean;
  /** レアリティ */
  rarities: string[];
  /** 官職 */
  generalTypes: string[];
  /** カード種別(スターター/通常/Ex) */
  varTypes: string[];
  /** メジャーバージョン */
  majorVersions: string[];
  /** 詳細バージョン */
  versions: string[];
  /** 詳細バージョン有効 */
  enableDetailVersion: boolean;
  /** ぽけっと武将 */
  pockets: string[];
}

export interface StrategiesFilterCondition {
  /** 計略表示切り替え */
  showStrategyExplanation: boolean;
  /** 必要士気 最小 */
  moraleMin: number;
  /** 必要士気 最大 */
  moraleMax: number;
  /** カテゴリ */
  strategyCategories: string[];
  /** 範囲 */
  strategyRanges: string[];
  /** 効果時間 */
  strategyTimes: string[];
  /** 計略名検索 */
  strategySearchName: string;
  /** 計略説明検索 */
  strategySearchExplanation: string;
}

export interface FilterCondition {
  basic: BasicFilterCondition;
  detail: DetailFilterCondition;
  strategies: StrategiesFilterCondition;
}

export type BasicFilterConditionKey = keyof BasicFilterCondition;
export type DetailFilterConditionKey = keyof DetailFilterCondition;
export type StrategiesFilterConditionKey = keyof StrategiesFilterCondition;

const initialBasicFilterCondition: BasicFilterCondition = {
  belongStates: [],
  costs: [],
  unitTypes: [],
  forceMin: 1,
  forceMax: 10,
  useCostRatioForce: false,
  costRatioForceMin: -4,
  costRatioForceMax: 5,
  costRatioBaseForces: {
    '10': 3,
    '15': 6,
    '20': 8,
    '25': 9,
    '30': 10,
  },
  intelligenceMin: 1,
  intelligenceMax: 10,
  conquestMin: 0,
  conquestMax: 4,
  skills: [],
  skillsAnd: false,
  searchText: '',
};

const initialDetailFilterCondition: DetailFilterCondition = {
  genMains: [],
  genMainsAnd: false,
  rarities: [],
  generalTypes: [],
  varTypes: [],
  majorVersions: [],
  versions: [],
  enableDetailVersion: false,
  pockets: [],
};

const initialStrategiesFilterCondition: StrategiesFilterCondition = {
  showStrategyExplanation: false,
  moraleMin: 1,
  moraleMax: 12,
  strategyCategories: [],
  strategyRanges: [],
  strategyTimes: [],
  strategySearchName: '',
  strategySearchExplanation: '',
};

const initialFilterCondition: FilterCondition = {
  basic: initialBasicFilterCondition,
  detail: initialDetailFilterCondition,
  strategies: initialStrategiesFilterCondition,
};

const initialFilterContents: FilterContents = {
  belongStates: [],
  costs: [],
  unitTypes: [],
  skills: [],
  genMains: [],
  rarities: [],
  generalTypes: [],
  varTypes: [],
  versions: [],
  majorVersions: [],
  strategyCategories: [],
  strategyRanges: [],
  strategyTimes: [],
};

export interface DatalistState {
  filterCondition: FilterCondition;
  effectiveFilterCondition: FilterCondition;
  filterContents: FilterContents;
  generals: General[];
  strategies: Strategy[];
  currentPage: number;
  pageLimit: number;
}

const initialState: DatalistState = {
  filterCondition: initialFilterCondition,
  effectiveFilterCondition: initialFilterCondition,
  filterContents: initialFilterContents,
  generals: [],
  strategies: [],
  currentPage: 1,
  pageLimit: 50,
};

export const datalistActions = {
  resetConditions: createAction('RESET_CONDITIONS')(),
  applyCondition: createAction('APPLY_CONDITION')(),
  setBasicCondition: createAction(
    'SET_BASIC_CONDITION',
    (condition: Partial<BasicFilterCondition>) => ({ condition })
  )(),
  setDetailCondition: createAction(
    'SET_DETAIL_CONDITION',
    (condition: Partial<DetailFilterCondition>) => ({ condition })
  )(),
  setStrategiesCondition: createAction(
    'SET_STRATEGIES_CONDITION',
    (condition: Partial<StrategiesFilterCondition>) => ({ condition })
  )(),
  setShowStrategyExplanation: createAction(
    'SET_SHOW_STRATEGY_EXPLANATION',
    (show: boolean) => show
  )(),
  setBaseData: createAction('SET_BASE_DATA', (baseData: BaseData) => ({
    baseData,
  }))(),
  incrementPage: createAction('INCREMENT_PAGE', () => ({ page: 1 }))(),
  resetPage: createAction('RESET_PAGE')(),
  decrementPage: createAction('DECREMENT_PAGE', () => ({ page: -1 }))(),
};

export default function datalistReducer(
  state: DatalistState = initialState,
  actions: ActionType<typeof datalistActions>
): DatalistState {
  switch (actions.type) {
    case 'RESET_CONDITIONS': {
      return {
        ...state,
        filterCondition: initialFilterCondition,
        effectiveFilterCondition: initialFilterCondition,
        currentPage: initialState.currentPage,
      };
    }
    case 'APPLY_CONDITION': {
      return {
        ...state,
        effectiveFilterCondition: cloneDeep(state.filterCondition),
        currentPage: initialState.currentPage,
      };
    }
    case 'SET_BASIC_CONDITION': {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          basic: {
            ...state.filterCondition.basic,
            ...actions.payload.condition,
          },
        },
      };
    }
    case 'SET_DETAIL_CONDITION': {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          detail: {
            ...state.filterCondition.detail,
            ...actions.payload.condition,
          },
        },
      };
    }
    case 'SET_STRATEGIES_CONDITION': {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          strategies: {
            ...state.filterCondition.strategies,
            ...actions.payload.condition,
          },
        },
      };
    }
    case 'SET_SHOW_STRATEGY_EXPLANATION': {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          strategies: {
            ...state.filterCondition.strategies,
            showStrategyExplanation: actions.payload,
          },
        },
      };
    }
    case 'SET_BASE_DATA': {
      const baseData = actions.payload.baseData;
      const { generals, strategies, filterContents } = baseData;
      return {
        ...state,
        filterCondition: initialFilterCondition,
        effectiveFilterCondition: initialFilterCondition,
        currentPage: initialState.currentPage,
        filterContents,
        generals,
        strategies,
      };
    }
    case 'RESET_PAGE': {
      return {
        ...state,
        currentPage: initialState.currentPage,
      };
    }
    case 'INCREMENT_PAGE':
    case 'DECREMENT_PAGE': {
      const page = actions.payload.page;
      return {
        ...state,
        currentPage: state.currentPage + page,
      };
    }
    default:
      return state;
  }
}
