import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register';
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute, UrlTree, NavigationEnd } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    
    // MOCK COMPLETO DEL ROUTER
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);
    routerSpy.serializeUrl.and.returnValue('fake-url');
    (routerSpy as any).events = of(new NavigationEnd(0, 'url', 'url'));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate weak password', () => {
    component.user.password = 'weak';
    component.onSubmit();
    expect(component.passwordError).toBeTruthy();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should register successfully', () => {
    component.user = { username: 'new', password: 'Strong123!', email: 'a@a.com' };
    authServiceSpy.register.and.returnValue(of({}));

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle register error', () => {
    component.user.password = 'Strong123!';
    authServiceSpy.register.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(component.error).toContain('Error al registrar');
  });
});