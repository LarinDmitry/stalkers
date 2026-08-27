import {api} from 'services/axios';

export enum UserSortField {
  ID = 'id',
  NAME = 'name',
  DAMAGE_DEALER = 'damageDealer',
  QUALITY = 'quality',
  STARS = 'stars',
  TEMPLE = 'temple',
  IS_ACTIVE = 'isActive',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

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

export interface GetUsersParams {
  isActive?: boolean;
  sortBy?: UserSortField;
  sortOrder?: SortOrder;
}

export const getUsersDetails = async (params?: GetUsersParams): Promise<UsersDetails[]> => {
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
