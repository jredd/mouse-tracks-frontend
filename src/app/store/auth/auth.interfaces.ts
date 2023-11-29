export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}


export interface LoginResponse {
  user_id: string;
  access: string;
  refresh: string;
}



export interface RefreshResponse {
  access: string;
  refresh: string;
}


export interface AuthState {
  user_id: string;
  accessToken: string;
  refreshToken: string;
  isLoading: boolean;
  error: any;
}


export interface TokenData {
  userId: string;
  accessToken: string;
  refreshToken: string;
}
