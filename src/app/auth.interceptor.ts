import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //console.log('AuthInterceptor: Interceptor ejecutándose para la URL:', req.url);
  const token = localStorage.getItem('token');

  if (token) {
    //console.log('AuthInterceptor: Token encontrado, adjuntando encabezado Authorization.', req.url);
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    //console.log('AuthInterceptor: Encabezados de la solicitud clonada:', cloned.headers.get('Authorization'));
    return next(cloned);
  }

  return next(req);
}; 