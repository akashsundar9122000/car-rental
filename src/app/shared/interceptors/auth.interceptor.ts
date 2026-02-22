import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Exclude auth routes from interceptor if needed, or if no headers exist, just proceed
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
