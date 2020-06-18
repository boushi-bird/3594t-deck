import type {
  FilterItem,
  Strategy,
  GeneralProps,
  General,
  DataItem,
  GenMainItem,
} from '3594t-deck';
import { createVersionLabel } from './createVersionLabel';
import {
  generalThumbUrl,
  generalAvatarUrl,
  generalOfficiallUrl,
} from '../utils/externalUrl';

type RawGeneral = General['raw'];
type Personal = General['personal'];

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
  public readonly genMains: readonly GenMainItem[];
  public readonly genMainSp: GenMainItem | null;
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
    return generalOfficiallUrl(this.code);
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
