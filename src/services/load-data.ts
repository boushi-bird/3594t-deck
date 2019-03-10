import { BaseData as RawBaseData } from './types/base-data';
import loadDataFromApi from './load-data-api';
import loadDataFromLocalStorage from './load-data-localstorage';
import mapToBaseData, { BaseData } from './map-basedata';

interface AllData {
  baseData: BaseData;
}

const preFetch = (async (): Promise<RawBaseData> => {
  return await loadDataFromApi();
})();

export const loadFromApi = async (): Promise<BaseData> => {
  const baseData = await preFetch;
  return mapToBaseData(baseData);
};

export const loadFromLocal = async (): Promise<AllData | null> => {
  const localData = await loadDataFromLocalStorage();
  if (localData == null) {
    return null;
  }
  return {
    baseData: mapToBaseData(localData['base_data']),
  };
};
