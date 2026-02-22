import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        authServiceMock = {
            login: vi.fn(),
            logout: vi.fn()
        };
        routerMock = {
            navigate: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should route to /admin-dashboard when isAdmin checked and role is ADMIN', () => {
        component.loginForm.patchValue({ email: 'admin@test.com', password: 'pass', isAdmin: true });
        authServiceMock.login.mockReturnValue(of({ role: 'ADMIN' }));

        component.onSubmit();

        expect(routerMock.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
    });
});
