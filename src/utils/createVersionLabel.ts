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
