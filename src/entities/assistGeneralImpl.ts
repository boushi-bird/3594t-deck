import type {
  AssistStrategy,
  AssistGeneralProps,
  AssistGeneral,
  DataItem,
} from '3594t-deck';
import { createVersionLabel } from './createVersionLabel';

type RawAssistGeneral = AssistGeneral['raw'];
type Personal = AssistGeneral['personal'];

export class AssistGeneralImpl implements AssistGeneral {
  public readonly id: string;
  public readonly raw: RawAssistGeneral;
  /** 登場弾(メジャー) */
  public readonly majorVersion: number;
  /** 登場弾(追加) */
  public readonly addVersion: number;
  /** EXカード */
  public readonly isEx: boolean;
  /** 武将名 */
  public readonly personal?: Personal;
  /** 勢力 */
  public readonly state: DataItem;
  /** 計略 */
  public readonly strategy: AssistStrategy;

  public constructor(
    id: string,
    raw: RawAssistGeneral,
    option: AssistGeneralProps
  ) {
    this.id = id;
    this.raw = raw;
    this.majorVersion = option.majorVersion;
    this.addVersion = option.addVersion;
    this.isEx = option.isEx;
    this.personal = option.personal;
    this.state = option.state;
    this.strategy = option.strategy;
  }
  /** コード */
  public get code(): string {
    return this.raw.code;
  }
  /** 武将名 */
  public get name(): string {
    if (!this.personal) {
      return '';
    }
    return this.personal.name;
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
    return `https://3594t.net/datalist/?v=ASSIST&s=POPUP_ASSIST&c=${this.code}`;
  }
  /** サムネイル画像URL */
  public get thumbUrl(): string {
    const code = this.code;
    return `https://3594t.net/img/card_small/${code}.jpg`;
  }
  /** アバター画像URL */
  public get avatarUrl(): string {
    const code = this.raw.avatar;
    return `https://3594t.net/img/avatar/${code}.png`;
  }
}
