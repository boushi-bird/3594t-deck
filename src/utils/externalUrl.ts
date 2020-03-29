/**
 * @param {string} code 武将カードのcodeまたはpocket_code
 * @return {string} 武将カードのサムネイル画像のURL
 */
export function generalThumbUrl(code: string): string {
  return `https://3594t.net/img/card_small/${code}.jpg`;
}

/**
 * @param {string} avatar 武将カードのavatarまたはpocket_avatar
 * @return {string} 武将カードのアバター画像のURL
 */
export function generalAvatarUrl(avatar: string): string {
  return `https://3594t.net/img/avatar/${avatar}.png`;
}

/**
 * @param {string} code 武将カードのcode
 * @return {string} 武将カードの公式ページURL
 */
export function generalOfficiallUrl(code: string): string {
  return `https://3594t.net/datalist/?v=GENERAL&s=POPUP_GENERAL&c=${code}`;
}

/**
 * @param {string} code 遊軍カードのcode
 * @return {string} 遊軍カードのサムネイル画像のURL
 */
export function assistThumbUrl(code: string): string {
  return `https://3594t.net/img/card_small/${code}.jpg`;
}

/**
 * @param {string} avatar 遊軍カードのavatar
 * @return {string} 遊軍カードのアバター画像のURL
 */
export function assistAvatarUrl(avatar: string): string {
  return `https://3594t.net/img/avatar/${avatar}.png`;
}

/**
 * @param {string} code 遊軍カードのcode
 * @return {string} 遊軍カードの公式ページURL
 */
export function assistOfficiallUrl(code: string): string {
  return `https://3594t.net/datalist/?v=ASSIST&s=POPUP_ASSIST&c=${code}`;
}

/**
 * @param {string} rangeCode 計略・戦技の範囲code
 * @return {string} 計略・戦技の範囲画像URL
 */
export function strategyRangeImageUrl(rangeCode: string): string {
  return `https://3594t.net/img/strat_range/${rangeCode}.png`;
}
