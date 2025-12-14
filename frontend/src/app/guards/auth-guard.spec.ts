import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth';
import { User } from '../models';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

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
    mockState = { url: '/protected' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    const mockUser: User = { id: 1, username: 'test', email: 'test@test.com', password: '' };
    Object.defineProperty(authServiceSpy, 'currentUserValue', { value: mockUser });

    spyOn(console, 'log');
    const result = executeGuard(mockRoute, mockState);

    expect(result).toBeTrue();
  });

  it('should redirect to login if user is not authenticated', () => {
    Object.defineProperty(authServiceSpy, 'currentUserValue', { value: null });

    spyOn(console, 'log');
    const result = executeGuard(mockRoute, mockState);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/protected' } });
  });
});
