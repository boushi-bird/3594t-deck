import type {
  AssistStrategy,
  AssistGeneral,
  RawAssistGeneral,
  PersonalWithRaw,
  BelongState,
} from '3594t-deck';
import { createVersionLabel } from './createVersionLabel';
import {
  assistOfficiallUrl,
  assistThumbUrl,
  assistAvatarUrl,
} from '../utils/externalUrl';

interface Props {
  /** 登場弾(メジャー) */
  readonly majorVersion: number;
  /** 登場弾(追加) */
  readonly addVersion: number;
  /** EXカード */
  readonly isEx: boolean;
  /** 武将名 */
  readonly personal: PersonalWithRaw;
  /** 勢力 */
  readonly state: BelongState;
  /** 計略 */
  readonly strategy: AssistStrategy;
}

export class AssistGeneralImpl implements AssistGeneral {
  /** 登場弾(メジャー) */
  public readonly majorVersion: number;
  /** 登場弾(追加) */
  public readonly addVersion: number;
  /** EXカード */
  public readonly isEx: boolean;
  /** 武将名 */
  public readonly personal: PersonalWithRaw;
  /** 勢力 */
  public readonly state: BelongState;
  /** 計略 */
  public readonly strategy: AssistStrategy;

  public constructor(
    public readonly id: string,
    public readonly raw: RawAssistGeneral,
    props: Props
  ) {
    Object.assign(this, props);
  }
  /** コード */
  public get code(): string {
    return this.raw.code;
  }
  /** 武将名 */
  public get name(): string {
    if ('name' in this.personal) {
      return this.personal.name;
    }
    return '';
  }
  /** 登場弾 */
  public get version(): string {
    return createVersionLabel(this.majorVersion, this.addVersion, this.isEx);
  }
  /** 登場弾(内部値) */
  public get versionValue(): string {
    const add = this.isEx ? '-EX' : `-${this.addVersion}`;
    return `${this.majorVersion}${add}`;
  }
  /** 公式ページへのURL */
  public get officialUrl(): string {
    return assistOfficiallUrl(this.code);
  }
  /** サムネイル画像URL */
  public get thumbUrl(): string {
    return assistThumbUrl(this.code);
  }
  /** アバター画像URL */
  public get avatarUrl(): string {
    const avatar = this.raw.avatar;
    return assistAvatarUrl(avatar);
  }
}
