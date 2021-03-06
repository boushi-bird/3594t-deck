import type {
  FilterItem,
  Strategy,
  RawGeneral,
  General,
  Personal,
  DataItem,
  KeyDataItem,
  GenMainItem,
  BelongState,
} from '3594t-deck';
import { createVersionLabel } from '../utils/createVersionLabel';

interface Props {
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

const EX_VER_TYPE = '2';

export default function (id: string, raw: RawGeneral, props: Props): General {
  const majorVersion = parseInt(raw.major_version);
  const addVersion = parseInt(raw.add_version);
  const verType = raw.ver_type;
  const isEx = verType === EX_VER_TYPE;
  // 登場弾
  const version = createVersionLabel(majorVersion, addVersion, isEx);
  // 登場弾(内部値)
  const add = isEx ? '-EX' : `-${addVersion}`;
  const versionValue = `${majorVersion}${add}`;
  return {
    id,
    majorVersion,
    addVersion,
    isEx,
    verType,
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
