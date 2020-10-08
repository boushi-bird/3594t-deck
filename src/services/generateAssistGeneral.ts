import type {
  AssistStrategy,
  AssistGeneral,
  RawAssistGeneral,
  Personal,
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
  /** 武将名 */
  readonly personal: Personal;
  /** 勢力 */
  readonly state: BelongState;
  /** 計略 */
  readonly strategy: AssistStrategy;
}

export default function (
  id: string,
  raw: RawAssistGeneral,
  props: Props
): AssistGeneral {
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
    code: raw.code,
    name: 'name' in props.personal ? props.personal.name : '',
    version,
    versionValue,
    avatar: raw.avatar,
    ...props,
  };
}
