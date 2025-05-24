import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;
if (typeof window !== 'undefined' && window.sessionStorage) {
  token = window.sessionStorage.getItem('authToken');
}

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  console.log("Auth Interceptor executed"); 

  return next(authReq);
};
