// path: crs-frontend/src/types/apiError.ts
// purpose: interface khop voi format loi JSON tra ve tu GlobalExceptionHandler
// (course-service va registration-service, xem lai Buoi 2 muc B.5 va Buoi 3 muc C.9)

export interface ApiErrorResponse {
  message?: string;
  [field: string]: string | undefined; // truong hop loi validation, key la ten field
}
