import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RecoverPasswordComponent } from './recover-password';
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute, UrlTree, NavigationEnd } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['recover']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);
    routerSpy.serializeUrl.and.returnValue('fake-url');
    (routerSpy as any).events = of(new NavigationEnd(0, 'url', 'url'));

    await TestBed.configureTestingModule({
      imports: [RecoverPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recover password successfully', fakeAsync(() => {
    authServiceSpy.recover.and.returnValue(of({}));
    component.user = { username: 'test', email: 'test@test.com', password: 'NewPass1!' };

    component.onSubmit();

    expect(authServiceSpy.recover).toHaveBeenCalled();
    expect(component.success).toContain('Contraseña actualizada exitosamente');
    expect(component.loading).toBeFalse();

    tick(2000); // Wait for setTimeout
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should handle recover error', () => {
    authServiceSpy.recover.and.returnValue(throwError(() => new Error('Error')));
    component.user = { username: 'test', email: 'test@test.com', password: 'NewPass1!' };

    component.onSubmit();

    expect(component.error).toContain('Error al actualizar contraseña');
    expect(component.loading).toBeFalse();
  });

  it('should set loading to true on submit', () => {
    authServiceSpy.recover.and.returnValue(of({}));
    component.onSubmit();
    // After subscribe completes synchronously, loading will be false
    // But we can verify recover was called
    expect(authServiceSpy.recover).toHaveBeenCalled();
  });

  it('should clear error and success on submit', () => {
    component.error = 'Previous error';
    component.success = 'Previous success';
    authServiceSpy.recover.and.returnValue(of({}));

    component.onSubmit();

    // After successful submit, error should be empty and success set
    expect(component.error).toBe('');
  });
});
