import { BaseData } from './types/baseData';
import { MemberData } from './types/memberData';

export interface SavedLocalData {
  base_data: BaseData;
  member_data?: MemberData;
  save_date?: string;
}

export default async (): Promise<SavedLocalData | null> => {
  const datalist = localStorage.getItem('3594t.net/datalist');
  if (!datalist) {
    return null;
  }
  const data: SavedLocalData = JSON.parse(datalist);
  return data;
};