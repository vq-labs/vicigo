import {FailedResponse} from '../../models/authentication';

export interface State {
  // is a user authenticated?
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  errorMessage: FailedResponse | string | { error: { code: string }};
  newPasswordRequested: boolean;
}

export const initialState: State = {
  isAuthenticated: false,
  isLoading: false,
  token: null,
  errorMessage: null,
  newPasswordRequested: false
};
