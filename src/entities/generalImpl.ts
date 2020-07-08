import type {
  FilterItem,
  Strategy,
  RawGeneral,
  PersonalWithRaw,
  DataItem,
  KeyDataItem,
  GenMainItem,
  SearchText,
  BelongState,
} from '3594t-deck';
import { createVersionLabel } from './createVersionLabel';
import {
  generalThumbUrl,
  generalAvatarUrl,
  generalOfficiallUrl,
} from '../utils/externalUrl';

interface Props {
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
  readonly genMains: readonly GenMainItem[];
  /** 奇才将器 */
  readonly genMainSp: GenMainItem | null;
  /** 官職 */
  readonly generalType: KeyDataItem;
  /** 武将名 */
  readonly personal: PersonalWithRaw;
  /** レアリティ */
  readonly rarity: DataItem;
  /** 特技 */
  readonly skills: readonly FilterItem[];
  /** 勢力 */
  readonly state: BelongState;
  /** 兵種 */
  readonly unitType: KeyDataItem;
  /** 計略 */
  readonly strategy: Strategy;
}

export class GeneralImpl implements Props {
  public readonly majorVersion: number;
  public readonly addVersion: number;
  public readonly isEx: boolean;
  public readonly force: number;
  public readonly intelligence: number;
  public readonly conquest: number;
  public readonly cost: DataItem;
  public readonly genMains: readonly GenMainItem[];
  public readonly genMainSp: GenMainItem | null;
  public readonly generalType: KeyDataItem;
  public readonly personal: PersonalWithRaw;
  public readonly rarity: DataItem;
  public readonly skills: readonly FilterItem[];
  public readonly state: BelongState;
  public readonly unitType: KeyDataItem;
  public readonly strategy: Strategy;

  public constructor(
    public readonly id: string,
    public readonly raw: RawGeneral,
    props: Props
  ) {
    Object.assign(this, props);
  }

  public get code(): string {
    return this.raw.code;
  }
  public get pocketCode(): string {
    return this.raw.pocket_code;
  }
  public get name(): string {
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
  public get officialUrl(): string {
    return generalOfficiallUrl(this.code);
  }
  public get searchText(): SearchText | null {
    if (!this.personal.raw) {
      return null;
    }
    return {
      text: this.personal.name,
      ruby: this.personal.raw.name_ruby_search || '',
    };
  }
  public thumbUrl(pocket: boolean): string {
    const code = pocket && this.hasPocket ? this.pocketCode : this.code;
    return generalThumbUrl(code);
  }
  public avatarUrl(pocket: boolean): string {
    const code =
      pocket && this.hasPocket ? this.raw.pocket_avatar : this.raw.avatar;
    return generalAvatarUrl(code);
  }
}
