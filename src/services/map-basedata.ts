import { BaseData as RawBaseData } from './types/base-data';

type RawGeneral = RawBaseData['GENERAL'][number];
type Personal = RawBaseData['PERSONAL'][number];

interface IdItem {
  readonly id: string;
}

interface Item {
  readonly code?: string;
  readonly name: string;
  readonly nameShort?: string;
  readonly color?: string;
  readonly thinColor?: string;
}

export interface FilterItem extends Item, IdItem {}

type RawStrategy = RawBaseData['STRAT'][number];

interface Strategy
  extends Pick<RawStrategy, Exclude<keyof RawStrategy, 'key'>> {}

interface GeneralProps {
  /** 登場弾(メジャー) */
  readonly majorVersion: number;
  /** 登場弾(追加) */
  readonly addVersion: number;
  /** EXカード */
  readonly isEx: boolean;
  /** 武力 */
  readonly force: number;
  /** 知力 */
  readonly intelligence: number;
  /** 征圧力 */
  readonly conquest: number;
  /** コスト */
  readonly cost: Item;
  /** 主将器 */
  readonly genMains: ReadonlyArray<FilterItem>;
  /** 官職 */
  readonly generalType: Item;
  /** 武将名 */
  readonly personal?: Personal;
  /** レアリティ */
  readonly rarity: Item;
  /** 特技 */
  readonly skills: ReadonlyArray<FilterItem>;
  /** 勢力 */
  readonly state: Item;
  /** 兵種 */
  readonly unitType: Item;
  /** 計略 */
  readonly strategy?: Strategy;
}

interface General extends IdItem, GeneralProps {
  readonly raw: RawGeneral;
  /** コード */
  readonly code: string;
  /** 武将名 */
  readonly name: string;
  /** 登場弾 */
  readonly version: string;
  /** 登場弾(内部値) */
  readonly versionValue: string;
  /** さんぽけあり */
  readonly hasPocket: boolean;
}

const createVersionLabel = (
  majorVersion: number | string,
  addVersion = 0,
  isEx = false
): string => {
  let add: string;
  if (isEx) {
    add = '-EX';
  } else if (addVersion > 0) {
    add = `-${addVersion}`;
  } else {
    add = '';
  }
  return `第${majorVersion}弾${add}`;
};

class GeneralImpl implements General {
  public readonly id: string;
  public readonly raw: RawGeneral;
  public readonly majorVersion: number;
  public readonly addVersion: number;
  public readonly isEx: boolean;
  public readonly force: number;
  public readonly intelligence: number;
  public readonly conquest: number;
  public readonly cost: Item;
  public readonly genMains: ReadonlyArray<FilterItem>;
  public readonly generalType: Item;
  public readonly personal?: Personal;
  public readonly rarity: Item;
  public readonly skills: ReadonlyArray<FilterItem>;
  public readonly state: Item;
  public readonly unitType: Item;
  public readonly strategy?: Strategy;
  public constructor(id: string, raw: RawGeneral, option: GeneralProps) {
    this.id = id;
    this.raw = raw;
    Object.assign(this, option);
  }
  public get code(): string {
    return this.raw.code;
  }
  public get name(): string {
    if (!this.personal) {
      return '';
    }
    return this.personal.name;
  }
  public get version(): string {
    return createVersionLabel(this.majorVersion, this.addVersion, this.isEx);
  }
  public get versionValue(): string {
    const add = this.isEx ? '-EX' : `-${this.addVersion}`;
    return `${this.majorVersion}${add}`;
  }
  public get hasPocket(): boolean {
    return this.raw.pocket_code !== '';
  }
}

export interface FilterContents {
  /** 勢力 */
  belongStates: FilterItem[];
  /** コスト */
  costs: FilterItem[];
  /** 兵種 */
  unitTypes: FilterItem[];
  /** 特技 */
  skills: FilterItem[];
  /** 主将器 */
  genMains: FilterItem[];
  /** レアリティ */
  rarities: FilterItem[];
  /** 官職 */
  generalTypes: FilterItem[];
  /** スターター/通常/Ex */
  varTypes: FilterItem[];
  /** 登場弾(メジャーバージョン) */
  versions: FilterItem[][];
  /** 登場弾(メジャーバージョン) */
  majorVersions: FilterItem[];
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
  array: ReadonlyArray<S>,
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

const emptyItem: Item = {
  name: '',
};

const findById = (filterItems: FilterItem[], id: string): Item => {
  const item = filterItems.find(v => v.id === id);
  if (!item) {
    return emptyItem;
  }
  return item;
};

const plain = <S>(s: (S | undefined)[]): S[] => s.filter(v => v != null) as S[];

const noSkillId = '0';
const exVerTypeId = '2';

export default (baseData: RawBaseData): BaseData => {
  // 勢力
  const belongStates = convertIdItem(baseData.STATE, idIsIndex, (s, id) => {
    const dist = toItem(s, id);
    return {
      ...dist,
      color: `rgb(${s.red}, ${s.green}, ${s.blue})`,
      thinColor: `rgba(${s.red}, ${s.green}, ${s.blue}, 0.2)`,
    };
  });
  // コスト
  const costs = objectToIdItems(baseData.COST, toItem);
  // 兵種
  const unitTypes = convertIdItem(baseData.UNIT_TYPE, idIsKey, (s, id) => {
    const dist = toItem(s, id);
    return {
      ...dist,
      nameShort: s.name[0],
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
  const strategies = convertIdItem(baseData.STRAT, idIsKey, (strat, id) => ({
    id,
    ...strat,
  }));
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
      strategy: strategies.find(v => v.id === raw.strat),
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
    },
    generals,
    strategies,
  };
};
