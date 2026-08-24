import {api} from 'services/axios';

export interface UserDamageRecord {
  damage: number;
  date: string;
  guildTotal: number;
  damageByDay: number[];
}

export interface UserDamageItem {
  name: string;
  info: UserDamageRecord[];
}

export const getAllUsersDamage = async (): Promise<UserDamageItem[]> => {
  const {data} = await api.get<UserDamageItem[]>('/user-damage');
  return data;
};
