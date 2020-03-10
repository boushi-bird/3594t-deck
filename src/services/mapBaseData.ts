import { BaseData as RawBaseData } from '@boushi-bird/3594t-net-datalist/read-only';
import {
  FilterItem,
  Strategy,
  General,
  DataItem,
  FilterContents,
} from '3594t-deck';
import { GeneralImpl, createVersionLabel } from '../entities/generalImpl';

interface IdItem {
  readonly id: string;
}

export interface BaseData {
  filterContents: FilterContents;
  /** 武将 */
  generals: General[];
  /** 計略 */
  strategies: Strategy[];
}

const idIsIndex = <V>(_v: V, i: number): string => `${i}`;
const idIsKey = <V extends { key: string }>(v: V): string => v.key;

const convertIdItem = <S, D extends IdItem>(
  array: readonly S[],
  convertId: (s: S, i: number) => string,
  convertValue: (t: S, id: string) => D
): D[] => array.map((s, i) => convertValue(s, convertId(s, i)));

const objectToIdItems = <S, D extends IdItem>(
  obj: { [key: string]: S } | { [key: number]: S },
  convertValue: (t: S, id: string) => D
): D[] => Object.entries(obj).map(([key, s]) => convertValue(s, `${key}`));

const toItem = (
  {
    code,
    name,
    name_short: nameShort,
    short_name: shortName,
  }: {
    code: string;
    name: string;
    name_short?: string;
    short_name?: string;
  },
  id: string
): FilterItem => ({
  id,
  code,
  name,
  nameShort: nameShort || shortName,
});

const emptyItem: DataItem = {
  name: '',
};

const emptyStrategy: Strategy = {
  id: '',
  code: '',
  explanation: '',
  rawExplanation: '',
  morale: 1,
  name: '',
  nameRuby: '',
  stratCategory: '',
  stratRange: '',
  stratTime: '',
};

const findById = (filterItems: FilterItem[], id: string): DataItem => {
  const item = filterItems.find(v => v.id === id);
  if (!item) {
    return emptyItem;
  }
  return item;
};

const plain = <S>(s: (S | undefined)[]): S[] => s.filter(v => v != null) as S[];

const noSkillId = '0';
const exVerTypeId = '2';

const convertStrategyExplanation = (explanation: string): string => {
  return (
    explanation
      // brタグを改行化
      .replace(/\<br\s*\/?\>/gi, '\n')
      // imgタグを除去しaltを表記
      .replace(/\<img.+?alt=\"(.*?)\".*?\/\>/gi, ' $1 ')
  );
};

export default (baseData: RawBaseData): BaseData => {
  // 勢力
  const belongStates = convertIdItem(baseData.STATE, idIsIndex, (s, id) => {
    const dist = toItem(s, id);
    return {
      ...dist,
      color: `rgb(${s.red}, ${s.green}, ${s.blue})`,
      thincolor: `rgba(${s.red}, ${s.green}, ${s.blue}, 0.2)`,
    };
  });
  // コスト
  const costs = objectToIdItems(baseData.COST, toItem);
  // 兵種
  const UNIT_TYPE_ALIAS: { [key: string]: string } = { ['連弩兵']: '弩' };
  const unitTypes = convertIdItem(baseData.UNIT_TYPE, idIsKey, (s, id) => {
    const dist = toItem(s, id);
    return {
      ...dist,
      nameShort: UNIT_TYPE_ALIAS[s.name] || s.name[0],
    };
  });
  // 特技
  const skills = convertIdItem(baseData.SKILL, idIsKey, toItem);
  // 主将器
  const genMains = convertIdItem(baseData.GEN_MAIN, idIsKey, toItem);
  // レアリティ
  const rarities = objectToIdItems(baseData.RARITY, toItem);
  // 官職
  const generalTypes = convertIdItem(
    baseData.GENERAL_TYPE,
    idIsKey,
    (s, id) => {
      const dist = toItem(s, id);
      if (s.name === '') {
        return {
          ...dist,
          name: 'なし(女性)',
        };
      }
      return dist;
    }
  );
  // スターター/通常/Ex
  const varTypes = convertIdItem(baseData.VER_TYPE, idIsIndex, toItem).map(
    v => {
      if (v.name === 'Ex') {
        return {
          ...v,
          name: 'EX',
        };
      }
      return v;
    }
  );
  // 計略
  const strategies: Strategy[] = convertIdItem(
    baseData.STRAT,
    idIsKey,
    (strat, id) => {
      const {
        morale,
        explanation: rawExplanation,
        name_ruby: nameRuby,
        strat_category: stratCategory,
        strat_range: stratRange,
        strat_time: stratTime,
        ...otherStrat
      } = strat;
      return {
        id,
        ...otherStrat,
        explanation: convertStrategyExplanation(rawExplanation),
        rawExplanation,
        morale: parseInt(morale),
        nameRuby,
        stratCategory,
        stratRange,
        stratTime,
      };
    }
  );
  // 登場弾
  const versions: { [key: number]: number[] } = {};
  // 武将
  const generals = convertIdItem(baseData.GENERAL, idIsIndex, (raw, id) => {
    const majorVersion = parseInt(raw.major_version);
    const addVersion = parseInt(raw.add_version);
    const isEx = raw.ver_type === exVerTypeId;
    if (!versions[majorVersion]) {
      versions[majorVersion] = [];
    }
    if (!isEx && !versions[majorVersion].includes(addVersion)) {
      versions[majorVersion].push(addVersion);
    }
    return new GeneralImpl(id, raw, {
      majorVersion,
      addVersion,
      isEx,
      force: parseInt(raw.buryoku),
      intelligence: parseInt(raw.chiryoku),
      conquest: parseInt(raw.seiatsu),
      cost: findById(costs, raw.cost),
      genMains: plain(
        [raw.gen_main0, raw.gen_main1, raw.gen_main2]
          .filter(v => v !== '')
          .map(v => genMains.find(g => g.id === v))
      ),
      generalType: findById(generalTypes, raw.general_type),
      personal: baseData.PERSONAL[parseInt(raw.personal)],
      rarity: findById(rarities, raw.rarity),
      skills: plain(
        [raw.skill0, raw.skill1, raw.skill2]
          .filter(v => v !== '' && v !== noSkillId)
          .map(v => skills.find(g => g.id === v))
      ),
      state: findById(belongStates, raw.state),
      unitType: findById(unitTypes, raw.unit_type),
      strategy: strategies.find(v => v.id === raw.strat) || emptyStrategy,
    });
  });
  const majorVersions = Object.keys(versions).map(v => parseInt(v));
  const sortNumber = (a: number, b: number): number => {
    return a - b;
  };
  majorVersions.sort(sortNumber);
  majorVersions.forEach(major => {
    versions[major].sort(sortNumber);
  });
  const strategyCategories = convertIdItem(
    baseData.STRAT_CATEGORY,
    idIsKey,
    toItem
  );
  const strategyRanges = convertIdItem(
    baseData.STRAT_RANGE,
    idIsIndex,
    (s, id) => ({
      id,
      code: s.code,
      name: '',
    })
  );
  const strategyTimes = convertIdItem(baseData.STRAT_TIME, idIsIndex, toItem);
  return {
    filterContents: {
      belongStates,
      costs,
      unitTypes,
      skills,
      genMains,
      rarities,
      generalTypes,
      varTypes,
      versions: Object.entries(versions).map(([k, addVersions]) => {
        const items = convertIdItem(
          addVersions,
          v => `${k}-${v}`,
          (v, id) => ({ id, name: createVersionLabel(k, v) })
        );
        items.push({
          id: `${k}-EX`,
          name: createVersionLabel(k, 0, true),
        });
        return items;
      }),
      majorVersions: convertIdItem(
        majorVersions,
        v => `${v}`,
        (v, id) => ({ id, name: createVersionLabel(v) })
      ),
      strategyCategories,
      strategyRanges,
      strategyTimes,
    },
    generals,
    strategies,
  };
};
