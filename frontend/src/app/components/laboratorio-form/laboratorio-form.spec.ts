import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaboratorioFormComponent } from './laboratorio-form';
import { LaboratorioService } from '../../services/laboratorio';
import { Router, ActivatedRoute, UrlTree, NavigationEnd } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LaboratorioFormComponent', () => {
  let component: LaboratorioFormComponent;
  let fixture: ComponentFixture<LaboratorioFormComponent>;
  let labServiceSpy: jasmine.SpyObj<LaboratorioService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRoute = {
    snapshot: {
      paramMap: {
        get: () => null
      }
    }
  };

  beforeEach(async () => {
    labServiceSpy = jasmine.createSpyObj('LaboratorioService', ['getById', 'create', 'update']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);
    routerSpy.serializeUrl.and.returnValue('fake-url');
    (routerSpy as any).events = of(new NavigationEnd(0, 'url', 'url'));

    await TestBed.configureTestingModule({
      imports: [LaboratorioFormComponent],
      providers: [
        { provide: LaboratorioService, useValue: labServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratorioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new laboratorio', () => {
    labServiceSpy.create.and.returnValue(of({ id: 1, nombre: 'New', direccion: 'D', telefono: 'T' }));

    component.onSubmit();

    expect(labServiceSpy.create).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('should update existing laboratorio', () => {
    component.isEditMode = true;
    component.laboratorio = { id: 5, nombre: 'Edit', direccion: 'D', telefono: 'T' };
    labServiceSpy.update.and.returnValue(of(component.laboratorio));

    component.onSubmit();

    expect(labServiceSpy.update).toHaveBeenCalledWith(5, component.laboratorio);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('should load laboratorio in edit mode', () => {
    const mockLab = { id: 10, nombre: 'Lab10', direccion: 'Dir10', telefono: 'Tel10' };
    labServiceSpy.getById.and.returnValue(of(mockLab));

    component.loadLaboratorio(10);

    expect(labServiceSpy.getById).toHaveBeenCalledWith(10);
    expect(component.laboratorio).toEqual(mockLab);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading laboratorio', () => {
    labServiceSpy.getById.and.returnValue(throwError(() => new Error('Load Error')));

    component.loadLaboratorio(10);

    expect(component.error).toBe('Error al cargar el laboratorio');
    expect(component.loading).toBeFalse();
  });

  it('should handle error when creating laboratorio', () => {
    labServiceSpy.create.and.returnValue(throwError(() => new Error('Create Error')));

    component.onSubmit();

    expect(component.error).toBe('Error al crear el laboratorio');
    expect(component.loading).toBeFalse();
  });

  it('should handle error when updating laboratorio', () => {
    component.isEditMode = true;
    component.laboratorio = { id: 5, nombre: 'Edit', direccion: 'D', telefono: 'T' };
    labServiceSpy.update.and.returnValue(throwError(() => new Error('Update Error')));

    component.onSubmit();

    expect(component.error).toBe('Error al actualizar el laboratorio');
    expect(component.loading).toBeFalse();
  });
});
