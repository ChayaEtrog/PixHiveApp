import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token'); // שליפת הטוקן מה-SessionStorage
  
  // אם קיים טוקן, משכפלים את הבקשה ומוסיפים את ה-Authorization Header
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  console.log("Auth Interceptor executed"); // לוג לבדיקה

  return next(authReq);
};
