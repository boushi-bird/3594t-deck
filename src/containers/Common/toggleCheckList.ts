import type {
  FilterContents,
  FilterItem,
  FilterSelectionMode,
} from '3594t-deck';
import type {
  BasicFilterCondition,
  BasicFilterConditionKey,
  DetailFilterCondition,
  DetailFilterConditionKey,
  StrategiesFilterCondition,
  StrategiesFilterConditionKey,
} from '../../modules/datalist';

const toggleCheckListVersion = ({
  mode,
  filterContents,
  filterCondition,
  value,
  checked,
}: {
  mode: FilterSelectionMode;
  filterContents: FilterItem[][];
  filterCondition: string[];
  value: string;
  checked: boolean;
}): string[] => {
  // 一旦該当のチェックをすべて外す
  let versions = filterCondition.filter((v) => !v.startsWith(`${value}-`));
  if (!checked) {
    // 該当の詳細バージョン取得
    const addVersions = ([] as FilterItem[])
      .concat(...filterContents)
      .filter((v) => v.id.startsWith(`${value}-`))
      .map((v) => v.id);
    if (mode === 'singular') {
      versions = addVersions;
    } else {
      versions = versions.concat(addVersions);
    }
  }
  return versions;
};

const toggleCheckListMajorVersion = (
  mode: FilterSelectionMode,
  filterContents: FilterItem[],
  filterCondition: string[],
  versions: string[],
  value: string,
  checked: boolean
): string[] => {
  let majorVersions = [...filterCondition];
  const majorVersion = value.split('-')[0];
  if (checked) {
    // 該当のチェックが全て外れている場合
    if (!versions.some((version) => version.startsWith(`${majorVersion}-`))) {
      majorVersions = majorVersions.filter(
        (version) => version !== majorVersion
      );
    }
  } else if (mode === 'singular') {
    majorVersions = [majorVersion];
  } else if (!majorVersions.includes(majorVersion)) {
    const addVersions = ([] as FilterItem[])
      .concat(...filterContents)
      .filter((v) => v.id.startsWith(`${majorVersion}-`))
      .map((v) => v.id);
    // 該当のチェックが全て入っている場合
    if (addVersions.every((id) => versions.includes(id))) {
      majorVersions.push(majorVersion);
    }
  }
  return majorVersions;
};

function toggleCheckList(
  mode: FilterSelectionMode,
  value: string,
  targetCondition: string[]
): { checked: boolean; targetValue: string[] } {
  const checked = targetCondition.includes(value);
  let targetValue;
  if (checked) {
    // チェック外す
    targetValue = targetCondition.filter((v) => v !== value);
  } else if (mode === 'singular') {
    // 対象のみチェック入れる
    targetValue = [value];
  } else {
    // チェック入れる
    targetValue = [...targetCondition, value];
  }
  return { checked, targetValue };
}

export function toggleBasicCheckList(
  mode: FilterSelectionMode,
  filterCondition: BasicFilterCondition,
  key: BasicFilterConditionKey,
  value: string
): Partial<BasicFilterCondition> {
  const targetCondition = filterCondition[key];
  if (!(targetCondition instanceof Array)) {
    console.warn(`${key} is not array.`);
    return {};
  }
  const { targetValue } = toggleCheckList(mode, value, targetCondition);
  return { [key]: targetValue };
}

export function toggleDetailCheckList(
  mode: FilterSelectionMode,
  state: {
    filterContents: FilterContents;
    filterCondition: DetailFilterCondition;
  },
  key: DetailFilterConditionKey,
  value: string
): Partial<DetailFilterCondition> {
  const targetCondition = state.filterCondition[key];
  if (!(targetCondition instanceof Array)) {
    console.warn(`${key} is not array.`);
    return {};
  }
  const { checked, targetValue } = toggleCheckList(
    mode,
    value,
    targetCondition
  );
  const conditions = { [key]: targetValue };
  switch (key) {
    case 'majorVersions': {
      return {
        ...conditions,
        versions: toggleCheckListVersion({
          mode,
          filterContents: state.filterContents.versions,
          filterCondition: state.filterCondition.versions,
          value,
          checked,
        }),
      };
    }
    case 'versions': {
      return {
        ...conditions,
        majorVersions: toggleCheckListMajorVersion(
          mode,
          state.filterContents.majorVersions,
          state.filterCondition.majorVersions,
          targetValue,
          value,
          checked
        ),
      };
    }
    default:
      return conditions;
  }
}

export function toggleStrategyCheckList(
  mode: FilterSelectionMode,
  filterCondition: StrategiesFilterCondition,
  key: StrategiesFilterConditionKey,
  value: string
): Partial<StrategiesFilterCondition> {
  const targetCondition = filterCondition[key];
  if (!(targetCondition instanceof Array)) {
    console.warn(`${key} is not array.`);
    return {};
  }
  const { targetValue } = toggleCheckList(mode, value, targetCondition);
  return { [key]: targetValue };
}
