import {api} from 'services/axios';

export interface StatisticItem {
  id: number;
  date: string;
  total: number;
  rate: number;
  newbies: number;
}

export const getGuildStatistic = async (): Promise<StatisticItem[]> => {
  const {data} = await api.get<StatisticItem[]>('/statistic');
  return data;
};
