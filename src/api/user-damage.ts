import {api} from 'services/axios';

export interface UserDamageRecord {
  damage: number;
  date: string;
  guildTotal: number | string;
  damageByDay: number[];
}

export interface UserDamageItem {
  name: string;
  info: UserDamageRecord[];
}

export interface CreateUserDamageDto {
  userId: number;
  date: string;
  damageByDay: number[];
}

export const getAllUsersDamage = async (): Promise<UserDamageItem[]> => {
  const {data} = await api.get<UserDamageItem[]>('/user-damage');
  return data;
};

export const getUserDamageInfo = async (userId: number): Promise<UserDamageItem> => {
  const {data} = await api.get<UserDamageItem>(`/user-damage/${userId}`);
  return data;
};

export const updateUserDamage = async (dto: CreateUserDamageDto) => {
  const {data} = await api.patch('/user-damage', dto);
  return data;
};
