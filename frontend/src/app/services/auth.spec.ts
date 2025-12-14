import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { User } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = { id: 1, username: 'testuser', email: 'test@test.com', password: 'pass123' };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store user in localStorage', () => {
    service.login('testuser', 'pass123').subscribe(user => {
      expect(user.username).toBe('testuser');
      expect(localStorage.getItem('currentUser')).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/users/me');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('authorization')).toContain('Basic');
    req.flush(mockUser);
  });

  it('should register a user', () => {
    const newUser: User = { username: 'newuser', email: 'new@test.com', password: 'Pass123!' };
    service.register(newUser).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/users/register');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should recover password', () => {
    const userData: User = { username: 'user', email: 'a@a.com', password: 'NewPass1!' };
    service.recover(userData).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/users/recover');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should return empty headers if no user logged in', () => {
    const headers = service.getAuthHeaders();
    expect(headers.get('authorization')).toBeNull();
  });
});
