import {
  FilterItem,
  Strategy,
  GeneralProps,
  General,
  DataItem,
} from '3594t-deck';

type RawGeneral = General['raw'];
type Personal = General['personal'];

export const createVersionLabel = (
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

export class GeneralImpl implements General {
  public readonly id: string;
  public readonly raw: RawGeneral;
  public readonly majorVersion: number;
  public readonly addVersion: number;
  public readonly isEx: boolean;
  public readonly force: number;
  public readonly intelligence: number;
  public readonly conquest: number;
  public readonly cost: DataItem;
  public readonly genMains: readonly FilterItem[];
  public readonly generalType: DataItem;
  public readonly personal?: Personal;
  public readonly rarity: DataItem;
  public readonly skills: readonly FilterItem[];
  public readonly state: DataItem;
  public readonly unitType: DataItem;
  public readonly strategy: Strategy;
  public constructor(id: string, raw: RawGeneral, option: GeneralProps) {
    this.id = id;
    this.raw = raw;
    Object.assign(this, option);
  }
  public get code(): string {
    return this.raw.code;
  }
  public get pocketCode(): string {
    return this.raw.pocket_code;
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
  public get officialUrl(): string {
    return `https://3594t.net/datalist/?v=GENERAL&s=POPUP_GENERAL&c=${this.code}`;
  }
  public thumbUrl(pocket: boolean): string {
    const code = pocket && this.hasPocket ? this.pocketCode : this.code;
    return `https://3594t.net/img/card_small/${code}.jpg`;
  }
  public avatarUrl(pocket: boolean): string {
    const code =
      pocket && this.hasPocket ? this.raw.pocket_avatar : this.raw.avatar;
    return `https://3594t.net/img/avatar/${code}.png`;
  }
}
