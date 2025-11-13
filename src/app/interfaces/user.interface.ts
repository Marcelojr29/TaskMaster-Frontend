export interface User {
    id: string;
    name: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
