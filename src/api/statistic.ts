import {api} from 'services/axios';

export interface StatisticItem {
  id: number;
  date: string;
  total: number | string;
  rate: number;
  newbies: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStatisticPayload {
  date: string;
  total: number | string;
  rate: number;
  newbies: number;
}

export interface GetStatisticParams {
  limit?: number;
  sortBy?: 'id' | 'date';
}

export type UpdateStatisticPayload = CreateStatisticPayload;

export const getGuildStatistic = async (params?: GetStatisticParams): Promise<StatisticItem[]> => {
  const {data} = await api.get<StatisticItem[]>('/statistic', {params});
  return data;
};

export const createGuildStatistic = async (payload: CreateStatisticPayload): Promise<StatisticItem> => {
  const {data} = await api.post<StatisticItem>('/statistic', payload);
  return data;
};

export const updateGuildStatistic = async ({
  id,
  ...payload
}: UpdateStatisticPayload & {id: number}): Promise<StatisticItem> => {
  const {data} = await api.patch<StatisticItem>(`/statistic/${id}`, payload);
  return data;
};

export const deleteGuildStatistic = async (id: number): Promise<void> => {
  await api.delete(`/statistic/${id}`);
};
