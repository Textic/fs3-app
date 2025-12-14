import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile'; // Asegúrate que el nombre del archivo sea correcto (profile.ts)
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../models';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = { id: 1, username: 'test', email: 'test@test.com', password: '' };

  beforeEach(async () => {
    // Creamos espías (mocks) de los servicios
    authServiceSpy = jasmine.createSpyObj('AuthService', ['updateProfile'], {
      currentUserValue: mockUser
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent], // Importante: ProfileComponent es standalone
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if no user is logged in', () => {
    // Redefinir la propiedad para devolver null
    Object.defineProperty(authServiceSpy, 'currentUserValue', { value: null });
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should validate password complexity', () => {
    component.user.password = '123'; // Contraseña débil
    component.onSubmit();
    expect(component.error).toContain('La nueva contraseña debe tener al menos 8 caracteres');
    expect(authServiceSpy.updateProfile).not.toHaveBeenCalled();
  });

  it('should call updateProfile on success', () => {
    component.user.password = 'Pass123!strong'; // Contraseña fuerte
    authServiceSpy.updateProfile.and.returnValue(of(mockUser)); // Simular éxito

    component.onSubmit();

    expect(authServiceSpy.updateProfile).toHaveBeenCalled();
    expect(component.success).toContain('Perfil actualizado');
    expect(component.user.password).toBe(''); // Debe limpiar la pass
  });

  it('should handle error on updateProfile', () => {
    component.user.password = 'Pass123!strong';
    authServiceSpy.updateProfile.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(component.error).toBe('Error al actualizar el perfil.');
  });
});