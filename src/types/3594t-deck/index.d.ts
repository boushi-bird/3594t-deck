interface IdItem {
  readonly id: string;
}

declare module '3594t-deck' {
  import { BaseData as RawBaseData } from '@boushi-bird/3594t-net-datalist/read-only';

  type RawGeneral = RawBaseData['GENERAL'][number];
  type Personal = RawBaseData['PERSONAL'][number];

  interface DataItem {
    readonly code?: string;
    readonly name: string;
    readonly nameShort?: string;
    readonly color?: string;
    readonly thinColor?: string;
  }

  interface FilterItem extends DataItem, IdItem {}

  interface Strategy {
    readonly id: string;
    readonly code: string;
    readonly explanation: string;
    readonly rawExplanation: string;
    readonly morale: number;
    readonly name: string;
    readonly nameRuby: string;
    readonly stratCategory: string;
    readonly stratRange: string;
    readonly stratTime: string;
  }

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
    readonly cost: DataItem;
    /** 主将器 */
    readonly genMains: readonly FilterItem[];
    /** 官職 */
    readonly generalType: DataItem;
    /** 武将名 */
    readonly personal?: Personal;
    /** レアリティ */
    readonly rarity: DataItem;
    /** 特技 */
    readonly skills: readonly FilterItem[];
    /** 勢力 */
    readonly state: DataItem;
    /** 兵種 */
    readonly unitType: DataItem;
    /** 計略 */
    readonly strategy: Strategy;
  }

  interface General extends IdItem, GeneralProps {
    readonly raw: RawGeneral;
    /** コード */
    readonly code: string;
    /** ぽけっとコード */
    readonly pocketCode: string;
    /** 武将名 */
    readonly name: string;
    /** 登場弾 */
    readonly version: string;
    /** 登場弾(内部値) */
    readonly versionValue: string;
    /** さんぽけあり */
    readonly hasPocket: boolean;
    /**
     * サムネイル画像URL取得
     * @param pocket trueなら ぽけっと武将画像
     */
    thumbUrl(pocket: boolean): string;
  }

  interface FilterContents {
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
    /** 計略カテゴリー */
    strategyCategories: FilterItem[];
    /** 計略範囲 */
    strategyRanges: FilterItem[];
    /** 計略効果時間 */
    strategyTimes: FilterItem[];
  }
}
