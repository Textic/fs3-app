import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { adminGuard } from './admin-guard';
import { AuthService } from '../services/auth';
import { User } from '../models';

describe('adminGuard', () => {
	let authServiceSpy: jasmine.SpyObj<AuthService>;
	let routerSpy: jasmine.SpyObj<Router>;
	let mockRoute: ActivatedRouteSnapshot;
	let mockState: RouterStateSnapshot;

	const executeGuard: CanActivateFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

	beforeEach(() => {
		authServiceSpy = jasmine.createSpyObj('AuthService', [], {
			currentUserValue: null
		});
		routerSpy = jasmine.createSpyObj('Router', ['navigate']);

		TestBed.configureTestingModule({
			providers: [
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: Router, useValue: routerSpy }
			]
		});

		mockRoute = {} as ActivatedRouteSnapshot;
		mockState = { url: '/admin' } as RouterStateSnapshot;
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});

	it('should return true if user is admin', () => {
		const mockAdmin: User = { id: 1, username: 'admin', email: 'admin@test.com', password: '', rol: 'admin' };
		Object.defineProperty(authServiceSpy, 'currentUserValue', { value: mockAdmin });

		spyOn(console, 'log');
		const result = executeGuard(mockRoute, mockState);

		expect(result).toBeTrue();
	});

	it('should return true if user has non-user role', () => {
		const mockOperator: User = { id: 1, username: 'operator', email: 'op@test.com', password: '', rol: 'operator' };
		Object.defineProperty(authServiceSpy, 'currentUserValue', { value: mockOperator });

		spyOn(console, 'log');
		const result = executeGuard(mockRoute, mockState);

		expect(result).toBeTrue();
	});

	it('should redirect to laboratorios if user has role user', () => {
		const mockUser: User = { id: 1, username: 'user', email: 'user@test.com', password: '', rol: 'user' };
		Object.defineProperty(authServiceSpy, 'currentUserValue', { value: mockUser });

		spyOn(console, 'log');
		const result = executeGuard(mockRoute, mockState);

		expect(result).toBeFalse();
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/laboratorios']);
	});

	it('should redirect if user is null', () => {
		Object.defineProperty(authServiceSpy, 'currentUserValue', { value: null });

		spyOn(console, 'log');
		const result = executeGuard(mockRoute, mockState);

		expect(result).toBeFalse();
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/laboratorios']);
	});
});
