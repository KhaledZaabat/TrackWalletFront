import { User } from '../models/me-response.model';

export type UserState = {
  user: User | null;
  status: 'idle' | 'loading' | 'loaded' | 'unauthenticated' | 'offline';
};

export const initialState: UserState = {
  user: null,
  status: 'idle',
};
