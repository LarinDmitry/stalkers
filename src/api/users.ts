import {api} from 'services/axios';

export interface UsersDetails {
  name: string;
  damageDealer: string;
  quality: string;
  stars: number;
  temple: number;
}

export const getUsersDetails = async (): Promise<UsersDetails[]> => {
  const {data} = await api.get<UsersDetails[]>('/users');
  return data;
};
