import type {
  FilterItem,
  Strategy,
  RawGeneral,
  GeneralWithRaw,
  Personal,
  DataItem,
  KeyDataItem,
  GenMainItem,
  BelongState,
} from '3594t-deck';
import { createVersionLabel } from '../utils/createVersionLabel';

interface Props {
  /** 登場弾(メジャー) */
  readonly majorVersion: number;
  /** 登場弾(追加) */
  readonly addVersion: number;
  /** EXカード */
  readonly isEx: boolean;
  /** コスト */
  readonly cost: DataItem;
  /** 主将器 */
  readonly genMains: readonly GenMainItem[];
  /** 奇才将器 */
  readonly genMainSp: GenMainItem | null;
  /** 官職 */
  readonly generalType: KeyDataItem;
  /** 武将名 */
  readonly personal: Personal;
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

export default function (
  id: string,
  raw: RawGeneral,
  props: Props
): GeneralWithRaw {
  // 登場弾
  const version = createVersionLabel(
    props.majorVersion,
    props.addVersion,
    props.isEx
  );
  // 登場弾(内部値)
  const add = props.isEx ? '-EX' : `-${props.addVersion}`;
  const versionValue = `${props.majorVersion}${add}`;
  return {
    id,
    raw,
    code: raw.code,
    pocketCode: raw.pocket_code,
    name: props.personal.name,
    version,
    versionValue,
    hasPocket: raw.pocket_code !== '',
    avatar: raw.avatar,
    pocketAvatar: raw.pocket_avatar,
    force: parseInt(raw.buryoku),
    intelligence: parseInt(raw.chiryoku),
    conquest: parseInt(raw.seiatsu),
    ...props,
  };
}
