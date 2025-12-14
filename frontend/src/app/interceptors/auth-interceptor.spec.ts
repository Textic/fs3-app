import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when user is in localStorage', () => {
    const mockUser = { username: 'testuser', password: 'testpass' };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    const mockRequest = new HttpRequest('GET', '/api/test');
    let capturedRequest: HttpRequest<any> | null = null;

    const mockHandler: HttpHandlerFn = (req) => {
      capturedRequest = req;
      return of({} as HttpEvent<any>);
    };

    interceptor(mockRequest, mockHandler);

    expect(capturedRequest).toBeTruthy();
    expect(capturedRequest!.headers.has('Authorization')).toBeTrue();
  });
});
