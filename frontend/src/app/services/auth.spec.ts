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

  it('should return currentUserValue as null initially', () => {
    expect(service.currentUserValue).toBeNull();
  });

  it('should logout and clear user data', () => {
    // Setup: simulate logged in user
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    service.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.currentUserValue).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should get all users', () => {
    // First login to set auth headers
    service.login('testuser', 'pass123').subscribe();
    httpMock.expectOne('/api/users/me').flush(mockUser);

    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should delete user', () => {
    // First login to set auth headers
    service.login('testuser', 'pass123').subscribe();
    httpMock.expectOne('/api/users/me').flush(mockUser);

    service.deleteUser(1).subscribe(res => {
      expect(res).toBe('Deleted');
    });

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush('Deleted');
  });

  it('should assign lab to user', () => {
    // First login to set auth headers
    service.login('testuser', 'pass123').subscribe();
    httpMock.expectOne('/api/users/me').flush(mockUser);

    service.assignLab(1, 10).subscribe(user => {
      expect(user).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/users/assign/1/lab/10');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockUser, laboratorioId: 10 });
  });

  it('should remove lab from user', () => {
    // First login to set auth headers
    service.login('testuser', 'pass123').subscribe();
    httpMock.expectOne('/api/users/me').flush(mockUser);

    service.removeLab(1).subscribe(user => {
      expect(user).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/users/assign/1/lab/remove');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockUser, laboratorioId: null });
  });

  it('should update user', () => {
    // First login to set auth headers
    service.login('testuser', 'pass123').subscribe();
    httpMock.expectOne('/api/users/me').flush(mockUser);

    service.updateUser(1, { rol: 'admin' }).subscribe(user => {
      expect(user.rol).toBe('admin');
    });

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockUser, rol: 'admin' });
  });

  it('should update profile with new password', () => {
    // First login to set auth headers
    service.login('testuser', 'pass123').subscribe();
    httpMock.expectOne('/api/users/me').flush(mockUser);

    const updatedUser: User = { ...mockUser, password: 'newPassword123' };
    service.updateProfile(updatedUser).subscribe(user => {
      expect(user).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/users/profile');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('should update profile keeping old password', () => {
    // First login to set auth headers
    service.login('testuser', 'pass123').subscribe();
    httpMock.expectOne('/api/users/me').flush(mockUser);

    const updatedUser: User = { ...mockUser, password: '' };
    service.updateProfile(updatedUser).subscribe(user => {
      expect(user).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/users/profile');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockUser, password: undefined });
  });

  it('should return auth headers when user is logged in', () => {
    // First login to set auth headers
    service.login('testuser', 'pass123').subscribe();
    httpMock.expectOne('/api/users/me').flush(mockUser);

    const headers = service.getAuthHeaders();
    expect(headers.get('authorization')).toContain('Basic');
  });
});
