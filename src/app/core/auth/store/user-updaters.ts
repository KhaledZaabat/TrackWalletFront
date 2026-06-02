import { PartialStateUpdater } from '@ngrx/signals';
import { UserState } from './user-state';
import { User } from '../models/me-response.model';

export function markUnauthenticated(): PartialStateUpdater<UserState> {
  return (_) => ({
    user: null,
    status: 'unauthenticated',
  });
}

export function markAuthenticated(user: User): PartialStateUpdater<UserState> {
  return (_) => ({
    user: user,
    status: 'loaded',
  });
}

export function markLoading(): PartialStateUpdater<UserState> {
  return (_) => ({
    user: null,
    status: 'loading',
  });
}

export function markOffline(): PartialStateUpdater<UserState> {
  return (_) => ({
    user: null,
    status: 'offline',
  });
}

export function markIdle(): PartialStateUpdater<UserState> {
  return (_) => ({
    user: null,
    status: 'idle',
  });
}
