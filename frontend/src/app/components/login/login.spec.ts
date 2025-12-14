import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute, UrlTree, NavigationEnd } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    
    // MOCK COMPLETO DEL ROUTER
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);
    routerSpy.serializeUrl.and.returnValue('fake-url');
    (routerSpy as any).events = of(new NavigationEnd(0, 'url', 'url'));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        // ActivatedRoute es necesario para RouterLink
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully', () => {
    authServiceSpy.login.and.returnValue(of({}));
    component.username = 'admin';
    component.password = '1234';
    
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('admin', '1234');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('should handle login error', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('401')));
    
    component.onSubmit();

    expect(component.error).toContain('Credenciales inválidas');
    expect(component.loading).toBeFalse();
  });
});