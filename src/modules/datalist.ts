import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  General,
  Strategy,
  AssistGeneral,
  FilterContents,
  SearchMode,
  FilterSelectionMode,
} from '3594t-deck';
import type { BaseData } from '../services/mapBaseData';
import cloneDeep from 'lodash-es/cloneDeep';
import {
  MIN_FORCE,
  MAX_FORCE,
  MIN_INTELIGENCE,
  MAX_INTELIGENCE,
  MIN_CONQUEST,
  MAX_CONQUEST,
} from '../const';

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
  /** 検索モード */
  searchMode: SearchMode;
  /** 絞り込み条件: 基本 */
  basic: BasicFilterCondition;
  /** 絞り込み条件: 詳細 */
  detail: DetailFilterCondition;
  /** 絞り込み条件: 計略 */
  strategies: StrategiesFilterCondition;
}

export type BasicFilterConditionKey = keyof BasicFilterCondition;
export type DetailFilterConditionKey = keyof DetailFilterCondition;
export type StrategiesFilterConditionKey = keyof StrategiesFilterCondition;

const initialBasicFilterCondition: BasicFilterCondition = {
  belongStates: [],
  costs: [],
  unitTypes: [],
  forceMin: MIN_FORCE,
  forceMax: MAX_FORCE,
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
  intelligenceMin: MIN_INTELIGENCE,
  intelligenceMax: MAX_INTELIGENCE,
  conquestMin: MIN_CONQUEST,
  conquestMax: MAX_CONQUEST,
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

export const initialFilterCondition: FilterCondition = {
  searchMode: 'general',
  basic: initialBasicFilterCondition,
  detail: initialDetailFilterCondition,
  strategies: initialStrategiesFilterCondition,
};

export const initialFilterContents: FilterContents = {
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
  assistStrategyCategories: [],
};

export interface DatalistState {
  filterCondition: FilterCondition;
  effectiveFilterCondition: FilterCondition;
  filterSelectionMode: FilterSelectionMode;
  filterContents: FilterContents;
  generals: General[];
  strategies: Strategy[];
  assistGenerals: AssistGeneral[];
  currentPage: number;
  pageLimit: number;
}

const initialState: DatalistState = {
  filterCondition: initialFilterCondition,
  effectiveFilterCondition: initialFilterCondition,
  filterSelectionMode: 'multiple',
  filterContents: initialFilterContents,
  generals: [],
  strategies: [],
  assistGenerals: [],
  currentPage: 1,
  pageLimit: 50,
};

export const datalistModule = createSlice({
  name: 'datalist',
  initialState,
  reducers: {
    resetConditions(state: DatalistState): DatalistState {
      return {
        ...state,
        filterCondition: initialFilterCondition,
        effectiveFilterCondition: initialFilterCondition,
        currentPage: initialState.currentPage,
      };
    },
    applyCondition(state: DatalistState): DatalistState {
      return {
        ...state,
        effectiveFilterCondition: cloneDeep(state.filterCondition),
        currentPage: initialState.currentPage,
      };
    },
    setSearchMode(
      state: DatalistState,
      action: PayloadAction<SearchMode>
    ): DatalistState {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          searchMode: action.payload,
        },
      };
    },
    setFilterSelectionMode(
      state: DatalistState,
      action: PayloadAction<FilterSelectionMode>
    ): DatalistState {
      return {
        ...state,
        filterSelectionMode: action.payload,
      };
    },
    setBasicCondition(
      state: DatalistState,
      action: PayloadAction<Partial<BasicFilterCondition>>
    ): DatalistState {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          basic: {
            ...state.filterCondition.basic,
            ...action.payload,
          },
        },
      };
    },
    setDetailCondition(
      state: DatalistState,
      action: PayloadAction<Partial<DetailFilterCondition>>
    ): DatalistState {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          detail: {
            ...state.filterCondition.detail,
            ...action.payload,
          },
        },
      };
    },
    setStrategiesCondition(
      state: DatalistState,
      action: PayloadAction<Partial<StrategiesFilterCondition>>
    ): DatalistState {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          strategies: {
            ...state.filterCondition.strategies,
            ...action.payload,
          },
        },
      };
    },
    setShowStrategyExplanation(
      state: DatalistState,
      action: PayloadAction<boolean>
    ): DatalistState {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          strategies: {
            ...state.filterCondition.strategies,
            showStrategyExplanation: action.payload,
          },
        },
      };
    },
    setBaseData(
      state: DatalistState,
      action: PayloadAction<BaseData>
    ): DatalistState {
      const {
        generals,
        strategies,
        assistGenerals,
        filterContents,
      } = action.payload;
      return {
        ...state,
        filterCondition: initialFilterCondition,
        effectiveFilterCondition: initialFilterCondition,
        currentPage: initialState.currentPage,
        filterContents,
        generals,
        strategies,
        assistGenerals,
      };
    },
    incrementPage(state: DatalistState): DatalistState {
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    },
    decrementPage(state: DatalistState): DatalistState {
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };
    },
    resetPage(state: DatalistState): DatalistState {
      return {
        ...state,
        currentPage: initialState.currentPage,
      };
    },
  },
});

export const datalistActions = datalistModule.actions;
