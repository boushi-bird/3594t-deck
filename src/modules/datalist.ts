import { ActionType, createAction } from 'typesafe-actions';
import { BaseData, FilterItem, FilterContents } from '../services/mapBaseData';
import cloneDeep from 'lodash-es/cloneDeep';

export type FilterItem = FilterItem;

export interface FilterCondition {
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
  /** 検索ワード */
  searchText: string;
}

export type FilterConditionKey = keyof FilterCondition;

const initialFilterCondition: FilterCondition = {
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
  genMains: [],
  genMainsAnd: false,
  rarities: [],
  generalTypes: [],
  varTypes: [],
  majorVersions: [],
  versions: [],
  enableDetailVersion: false,
  pockets: [],
  searchText: '',
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
};

export interface DatalistState {
  filterCondition: FilterCondition;
  effectiveFilterCondition: FilterCondition;
  filterContents: FilterContents;
  generals: BaseData['generals'];
}

const initialState: DatalistState = {
  filterCondition: initialFilterCondition,
  effectiveFilterCondition: initialFilterCondition,
  filterContents: initialFilterContents,
  generals: [],
};

export const datalistActions = {
  resetConditions: createAction('RESET_CONDITIONS'),
  applyCondition: createAction('APPLY_CONDITION'),
  setCondition: createAction(
    'SET_CONDITION',
    action => (condition: Partial<FilterCondition>) => action({ condition })
  ),
  setBaseData: createAction('SET_BASE_DATA', action => (baseData: BaseData) =>
    action({ baseData })
  ),
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
      };
    }
    case 'APPLY_CONDITION': {
      return {
        ...state,
        effectiveFilterCondition: cloneDeep(state.filterCondition),
      };
    }
    case 'SET_CONDITION': {
      return {
        ...state,
        filterCondition: {
          ...state.filterCondition,
          ...actions.payload.condition,
        },
      };
    }
    case 'SET_BASE_DATA': {
      const baseData = actions.payload.baseData;
      const { generals, filterContents } = baseData;
      return {
        ...state,
        filterCondition: initialFilterCondition,
        effectiveFilterCondition: initialFilterCondition,
        filterContents,
        generals,
      };
    }
    default:
      return state;
  }
}
