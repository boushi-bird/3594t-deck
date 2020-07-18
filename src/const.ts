/** 範囲を持つ値 */
type RangeValue = Readonly<{
  /** 最小値 */
  min: number;
  /** 最大値 */
  max: number;
  /** 規定値 */
  defaultValue: number;
  /** 刻み値 */
  step?: number;
}>;

/** 最小武力 */
export const MIN_FORCE = 1;
/** 最大武力 */
export const MAX_FORCE = 11;
/** 最小知力 */
export const MIN_INTELIGENCE = 1;
/** 最大知力 */
export const MAX_INTELIGENCE = 11;
/** 最小征圧力 */
export const MIN_CONQUEST = 0;
/** 最大征圧力 */
export const MAX_CONQUEST = 4;

/** 1コスト最小武力 */
export const MIN_FORCE_10 = MIN_FORCE;
/** 1コスト最大武力 */
export const MAX_FORCE_10 = 5;
/** 1.5コスト最小武力 */
export const MIN_FORCE_15 = 2;
/** 1.5コスト最大武力 */
export const MAX_FORCE_15 = 7;
/** 2コスト最小武力 */
export const MIN_FORCE_20 = 5;
/** 2コスト最大武力 */
export const MAX_FORCE_20 = 9;
/** 2.5コスト最小武力 */
export const MIN_FORCE_25 = 6;
/** 2.5コスト最大武力 */
export const MAX_FORCE_25 = 10;
/** 3コスト最小武力 */
export const MIN_FORCE_30 = 8;
/** 3コスト最大武力 */
export const MAX_FORCE_30 = MAX_FORCE;

/** 最大士気 */
export const MAX_MORALE_LIMIT = 12;
/** 魅力による士気 */
export const CHARM_MORALE = 40;
/** 主将器:士気による士気 */
export const GEN_MAIN_MORALE = 40;

/** デッキのコスト */
export const DECK_COST_LIMIT: RangeValue = {
  min: 10,
  max: 250,
  defaultValue: 80,
  step: 5,
};

/** デッキに入れられる遊軍カード数 */
export const DECK_ASSIST_CARD_COUNT: RangeValue = {
  min: 0,
  max: 1,
  defaultValue: 1,
};

/** 覚醒できる主将器の最大ポイント数 */
export const GEN_MAIN_AWAKENING_LIMIT: RangeValue = {
  min: 0,
  max: 8,
  defaultValue: 3,
};

/** デッキに入れられる武将カード最大数 */
export const MAX_DECK_GENERAL_CARD_COUNT = 8;
/** 奇才将器覚醒時に使用する主将器ポイント数 */
export const DEFAULT_GEN_MAIN_SP_AWAKENING_COUNT = 3;

/** 兵種略称のalias */
export const UNIT_TYPE_NAME_SHORT_ALIAS: { [key: string]: string } = {
  ['連弩兵']: '弩',
};
