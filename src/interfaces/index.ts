import { BaseData as RawBaseData } from '../services/types/baseData';
import { DataItem } from './dataItem';

type RawGeneral = RawBaseData['GENERAL'][number];
type Personal = RawBaseData['PERSONAL'][number];

interface IdItem {
  readonly id: string;
}

export interface FilterItem extends DataItem, IdItem {}

export interface Strategy {
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

export interface GeneralProps {
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

export interface General extends IdItem, GeneralProps {
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
  /**
   * サムネイル画像URL取得
   * @param pocket trueなら ぽけっと武将画像
   */
  thumbUrl(pocket: boolean): string;
}
