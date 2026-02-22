import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';

export interface SalesData {
    totalRevenue: number;
    totalBookings: number;
    activeCars: number;
    revenueByMonth: { [key: string]: number };
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private readonly API_URL = `${environment.apiUrl}/admin/dashboard`;

    getSalesData(): Observable<SalesData> {
        const headersObj = this.authService.getAuthHeaders() as Record<string, string>;
        const headers = new HttpHeaders(headersObj);
        return this.http.get<SalesData>(`${this.API_URL}/sales`, { headers });
    }
}
