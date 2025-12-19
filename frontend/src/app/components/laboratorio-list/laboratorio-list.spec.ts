import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaboratorioListComponent } from './laboratorio-list';
import { LaboratorioService } from '../../services/laboratorio';
import { AuthService } from '../../services/auth';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Laboratorio } from '../../models';

describe('LaboratorioListComponent', () => {
  let component: LaboratorioListComponent;
  let fixture: ComponentFixture<LaboratorioListComponent>;
  let labServiceSpy: jasmine.SpyObj<LaboratorioService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    labServiceSpy = jasmine.createSpyObj('LaboratorioService', ['getAll', 'delete']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUserValue: { id: 1, username: 'admin', rol: 'admin', email: '', password: '' }
    });

    labServiceSpy.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [LaboratorioListComponent],
      providers: [
        { provide: LaboratorioService, useValue: labServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratorioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load laboratorios successfully', () => {
    const labs: Laboratorio[] = [{ id: 1, nombre: 'Lab1', direccion: 'A', telefono: '1' }];
    labServiceSpy.getAll.and.returnValue(of(labs));

    component.loadLaboratorios();

    expect(component.laboratorios.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should handle load error', () => {
    labServiceSpy.getAll.and.returnValue(throwError(() => new Error('Error')));
    component.loadLaboratorios();
    expect(component.error).toBe('Error al cargar laboratorios');
    expect(component.loading).toBeFalse();
  });

  it('should delete laboratorio if confirmed', () => {
    labServiceSpy.delete.and.returnValue(of(undefined));

    component.laboratorios = [{ id: 10, nombre: 'L', direccion: 'D', telefono: 'T' }];

    // Abrir modal
    component.deleteLaboratorio(10);
    expect(component.showModal).toBeTrue();
    expect(component.labToDelete).toBe(10);

    // Confirmar eliminación
    component.confirmDelete();

    expect(labServiceSpy.delete).toHaveBeenCalledWith(10);
    expect(component.laboratorios.length).toBe(0);
    expect(component.showModal).toBeFalse();
  });

  it('should NOT delete if cancelled', () => {
    // Abrir modal
    component.deleteLaboratorio(10);
    expect(component.showModal).toBeTrue();

    // Cerrar modal sin confirmar
    component.closeModal();

    expect(labServiceSpy.delete).not.toHaveBeenCalled();
    expect(component.showModal).toBeFalse();
  });

  it('should handle delete error', () => {
    spyOn(window, 'alert');
    labServiceSpy.delete.and.returnValue(throwError(() => new Error('Err')));

    // Abrir modal y confirmar
    component.deleteLaboratorio(10);
    component.confirmDelete();

    expect(window.alert).toHaveBeenCalledWith('Error al eliminar laboratorio');
    expect(component.showModal).toBeFalse();
  });

  it('should verify user role', () => {
    // Caso Admin (definido en beforeEach) -> isUser debe ser false
    expect(component.isUser).toBeFalse();

    // Caso User
    Object.defineProperty(authServiceSpy, 'currentUserValue', {
      value: { id: 2, username: 'user', rol: 'user' }
    });
    expect(component.isUser).toBeTrue();
  });

  it('should ignore delete request if id is undefined', () => {
    spyOn(window, 'confirm');
    component.deleteLaboratorio(undefined);
    expect(window.confirm).not.toHaveBeenCalled();
    expect(labServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should return false for isUser if not logged in', () => {
    Object.defineProperty(authServiceSpy, 'currentUserValue', { value: null });
    expect(component.isUser).toBeFalsy();
  });
});