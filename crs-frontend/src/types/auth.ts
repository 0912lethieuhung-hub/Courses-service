// path: crs-frontend/src/types/auth.ts
// purpose: interface khop voi LoginRequestDTO/LoginResponseDTO ben auth-service (Buoi 4)

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: 'ADMIN' | 'STUDENT';
}
