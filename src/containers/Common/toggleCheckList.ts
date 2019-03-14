import {
  DatalistState,
  FilterCondition,
  FilterConditionKey,
  FilterItem,
} from '../../modules/datalist';

const toggleCheckListVersion = ({
  filterContents,
  filterCondition,
  value,
  checked,
}: {
  filterContents: FilterItem[][];
  filterCondition: string[];
  value: string;
  checked: boolean;
}): string[] => {
  // 一旦該当のチェックをすべて外す
  let versions = filterCondition.filter(v => !v.startsWith(`${value}-`));
  if (!checked) {
    // 該当のチェックをすべて入れる
    const versionItems = ([] as FilterItem[])
      .concat(...filterContents)
      .filter(v => v.id.startsWith(`${value}-`));
    versions = versions.concat(versionItems.map(v => v.id));
  }
  return versions;
};

const toggleCheckListMajorVersion = (
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
    if (!versions.some(version => version.startsWith(`${majorVersion}-`))) {
      majorVersions = majorVersions.filter(version => version !== majorVersion);
    }
  } else if (!majorVersions.includes(majorVersion)) {
    const versionItems = ([] as FilterItem[])
      .concat(...filterContents)
      .filter(v => v.id.startsWith(`${majorVersion}-`));
    // 該当のチェックが全て入っている場合
    if (versionItems.every(v => versions.includes(v.id))) {
      majorVersions.push(majorVersion);
    }
  }
  return majorVersions;
};

export default function toggleCheckList(
  state: DatalistState,
  key: FilterConditionKey,
  value: string
): Partial<FilterCondition> {
  const targetCondition = state.filterCondition[key];
  if (!(targetCondition instanceof Array)) {
    console.warn(`${key} is not array.`);
    return {};
  }
  const checked = targetCondition.includes(value);
  let targetValue;
  if (checked) {
    // チェック外す
    targetValue = targetCondition.filter(v => v !== value);
  } else {
    // チェック入れる
    targetValue = [...targetCondition, value];
  }
  const conditions = { [key]: targetValue };
  switch (key) {
    case 'majorVersions': {
      return {
        ...conditions,
        versions: toggleCheckListVersion({
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
