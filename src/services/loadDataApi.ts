import { BaseData } from './types/baseData';

export default async (): Promise<BaseData> => {
  const res: Response = await fetch(process.env.BASE_DATA_URL as string);
  const baseData: BaseData = await res.json();
  return baseData;
};