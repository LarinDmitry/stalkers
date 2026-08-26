import {api} from 'services/axios';

export interface UsersDetails {
  id: number;
  name: string;
  damageDealer: string;
  quality: string;
  stars: number;
  temple: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateUserPayload = Omit<UsersDetails, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserPayload = Partial<CreateUserPayload>;

export const getUsersDetails = async (isActive?: boolean): Promise<UsersDetails[]> => {
  const params = typeof isActive === 'boolean' ? {isActive} : {};
  const {data} = await api.get<UsersDetails[]>('/users', {params});
  return data;
};

export const createUser = async (payload: CreateUserPayload): Promise<UsersDetails> => {
  const {data} = await api.post<UsersDetails>('/users', payload);
  return data;
};

export const updateUser = async ({id, ...payload}: {id: number} & UpdateUserPayload): Promise<UsersDetails> => {
  const {data} = await api.patch<UsersDetails>(`/users/${id}`, payload);
  return data;
};
