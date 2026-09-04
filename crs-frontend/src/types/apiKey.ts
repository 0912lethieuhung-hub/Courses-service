// path: crs-frontend/src/types/apiKey.ts
// purpose: interface khop voi ApiKeyResponseDTO/ApiKeyCreateRequestDTO ben auth-service

export interface ApiKey {
  id: number;
  keyValue: string;
  ownerName: string;
  scopes: string;
  status: 'ACTIVE' | 'REVOKED';
  expiresAt: string | null;
  createdAt: string;
}

export interface ApiKeyCreateRequest {
  ownerName: string;
  scopes: string;
  validDays?: number;
}
