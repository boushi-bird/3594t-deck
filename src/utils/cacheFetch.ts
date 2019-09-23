import { localStorageAvailable } from './storageAvailable';

function isStatus2xx(status: number) {
  return status >= 200 && status < 300;
}

async function fetchMd5(url: string): Promise<string | null> {
  const res: Response = await fetch(url + '.md5');
  if (!isStatus2xx(res.status)) {
    return null;
  }
  const md5 = await res.text();
  return md5.trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function _cacheFetch(url: string, keyName: string): Promise<any | null> {
  const keyNameMd5 = keyName + '.md5';
  const md5 = await fetchMd5(url);
  if (!md5) {
    localStorage.removeItem(keyNameMd5);
    localStorage.removeItem(keyName);
    return null;
  }
  const cachedMd5 = localStorage.getItem(keyNameMd5);
  if (cachedMd5 && cachedMd5 === md5) {
    const cached = localStorage.getItem(keyName);
    if (cached) {
      return JSON.parse(cached);
    }
  }
  const res = await fetch(url);
  const result = await res.json();
  localStorage.setItem(keyName, JSON.stringify(result));
  localStorage.setItem(keyNameMd5, md5);
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function(url: string, keyName: string): Promise<any> {
  if (localStorageAvailable()) {
    const result = await _cacheFetch(url, keyName);
    if (result) {
      return result;
    }
  }
  const res = await fetch(url);
  return res.json();
}
