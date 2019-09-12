import { BaseData } from '@boushi-bird/3594t-net-datalist/read-only';

export default async (): Promise<BaseData> => {
  const res: Response = await fetch(process.env.BASE_DATA_URL as string);
  const baseData: BaseData = await res.json();
  return baseData;
};
