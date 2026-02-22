import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Do NOT attach auth headers to login/signup endpoints
    // This prevents stale credentials from causing 401 errors
    const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/signup');
    if (isAuthEndpoint) {
        return next(req);
    }

    const headers = authService.getAuthHeaders();

    if (headers.Authorization) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: headers.Authorization
            }
        });
        return next(clonedReq);
    }

    return next(req);
};
