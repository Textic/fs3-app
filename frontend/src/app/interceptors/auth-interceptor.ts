import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('currentUser');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user && user.username && user.password) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${btoa(user.username + ':' + user.password)}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
