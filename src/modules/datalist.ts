import { ActionType, createAction } from 'typesafe-actions';
import { BaseData, FilterItem, FilterContents } from '../services/map-basedata';

export type FilterItem = FilterItem;

export interface FilterCondition {
  /** 勢力 */
  belongStates: string[];
  /** コスト */
  costs: string[];
  /** 兵種 */
  unitTypes: string[];
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

const initialFilterCondition: FilterCondition = {
  belongStates: [],
  costs: [],
  unitTypes: [],
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
  filterContents: FilterContents;
  generals: BaseData['generals'];
}

const initialState: DatalistState = {
  filterCondition: initialFilterCondition,
  filterContents: initialFilterContents,
  generals: [],
};

export const datalistActions = {
  resetConditions: createAction('RESET_CONDITIONS'),
  setCondition: createAction(
    'SET_CONDITION',
    action => (condition: Partial<FilterCondition>) => action({ condition })
  ),
  toggleCheckList: createAction(
    'TOGGLE_CHECK_LIST',
    action => (key: keyof FilterCondition, value: string) =>
      action({ key, value })
  ),
  toggleCheck: createAction(
    'TOGGLE_CHECK',
    action => (key: keyof FilterCondition, value: boolean) =>
      action({ key, value })
  ),
  setBaseData: createAction('SET_BASE_DATA', action => (baseData: BaseData) =>
    action({ baseData })
  ),
};

const toggleCheckList = (
  state: DatalistState,
  key: keyof FilterCondition,
  value: string,
  targetCondition: string[]
): DatalistState => {
  let targetValue;
  if (targetCondition.includes(value)) {
    // チェック外す
    targetValue = targetCondition.filter(v => v !== value);
  } else {
    // チェック入れる
    targetValue = [...targetCondition, value];
  }
  return {
    ...state,
    filterCondition: {
      ...state.filterCondition,
      [key]: targetValue,
    },
  };
};

const toggleCheckListMajorVersion = (
  state: DatalistState,
  value: string
): DatalistState => {
  const targetCondition = state.filterCondition.majorVersions;
  let versions = state.filterCondition.versions.filter(
    v => !v.startsWith(`${value}-`)
  );
  let majorVersions;
  if (targetCondition.includes(value)) {
    // チェック外す
    majorVersions = targetCondition.filter(v => v !== value);
  } else {
    // チェック入れる
    const versionItems = ([] as FilterItem[])
      .concat(...state.filterContents.versions)
      .filter(v => v.id.startsWith(`${value}-`));
    majorVersions = [...targetCondition, value];
    versions = versions.concat(versionItems.map(v => v.id));
  }
  return {
    ...state,
    filterCondition: {
      ...state.filterCondition,
      majorVersions,
      versions,
    },
  };
};

const toggleCheckListVersion = (
  state: DatalistState,
  value: string
): DatalistState => {
  const targetCondition = state.filterCondition.versions;
  let majorVersions = [...state.filterCondition.majorVersions];
  const majorVersion = value.split('-')[0];
  // const majorVersions = state.filterCondition.majorVersions;
  let versions: string[];
  if (targetCondition.includes(value)) {
    // チェック外す
    versions = targetCondition.filter(v => v !== value);
    if (!versions.some(version => version.startsWith(`${majorVersion}-`))) {
      majorVersions = majorVersions.filter(version => version !== majorVersion);
    }
  } else {
    // チェック入れる
    versions = [...targetCondition, value];
    if (!majorVersions.includes(majorVersion)) {
      const versionItems = ([] as FilterItem[])
        .concat(...state.filterContents.versions)
        .filter(v => v.id.startsWith(`${majorVersion}-`));
      if (versionItems.every(v => versions.includes(v.id))) {
        majorVersions.push(majorVersion);
      }
    }
  }
  return {
    ...state,
    filterCondition: {
      ...state.filterCondition,
      versions,
      majorVersions,
    },
  };
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
    case 'TOGGLE_CHECK_LIST': {
      const { key, value } = actions.payload;
      const targetCondition = state.filterCondition[key];
      if (!(targetCondition instanceof Array)) {
        console.warn(`${key} is not array.`);
        return state;
      }
      if (key === 'majorVersions') {
        return toggleCheckListMajorVersion(state, value);
      }
      if (key === 'versions') {
        return toggleCheckListVersion(state, value);
      }
      return toggleCheckList(state, key, value, targetCondition);
    }
    case 'TOGGLE_CHECK': {
      const { key, value } = actions.payload;
      const targetCondition = state.filterCondition[key];
      if (!(targetCondition instanceof Boolean)) {
        console.warn(`${key} is not boolean.`);
        return state;
      }
      return {
        ...state,
        [key]: !value,
      };
    }
    case 'SET_BASE_DATA': {
      const baseData = actions.payload.baseData;
      const { generals, filterContents } = baseData;
      return {
        ...state,
        filterCondition: initialFilterCondition,
        filterContents,
        generals,
      };
    }
    default:
      return state;
  }
}
