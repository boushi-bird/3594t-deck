import { BaseData as RawBaseData } from './types/baseData';
import loadDataFromApi from './loadDataApi';
import loadDataFromLocalStorage from './loadDataLocalStorage';
import mapToBaseData, { BaseData } from './mapBaseData';

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
