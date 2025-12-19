import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultadoFormComponent } from './resultado-form';
import { ResultadoService } from '../../services/resultado';
import { AuthService } from '../../services/auth';
import { LaboratorioService } from '../../services/laboratorio';
import { Router, ActivatedRoute, UrlTree, NavigationEnd } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('ResultadoFormComponent', () => {
	let component: ResultadoFormComponent;
	let fixture: ComponentFixture<ResultadoFormComponent>;
	let resultadoServiceSpy: jasmine.SpyObj<ResultadoService>;
	let authServiceSpy: jasmine.SpyObj<AuthService>;
	let labServiceSpy: jasmine.SpyObj<LaboratorioService>;
	let routerSpy: jasmine.SpyObj<Router>;

	const activatedRouteMock = {
		snapshot: {
			paramMap: {
				get: (key: string) => null
			}
		}
	};

	beforeEach(async () => {
		resultadoServiceSpy = jasmine.createSpyObj('ResultadoService', ['getById', 'create', 'update']);
		authServiceSpy = jasmine.createSpyObj('AuthService', ['getAllUsers']);
		labServiceSpy = jasmine.createSpyObj('LaboratorioService', ['getAll']);

		routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
		routerSpy.createUrlTree.and.returnValue({} as UrlTree);
		routerSpy.serializeUrl.and.returnValue('fake-url');
		(routerSpy as any).events = of(new NavigationEnd(0, 'url', 'url'));

		authServiceSpy.getAllUsers.and.returnValue(of([]));
		labServiceSpy.getAll.and.returnValue(of([]));

		await TestBed.configureTestingModule({
			imports: [ResultadoFormComponent],
			providers: [
				provideHttpClient(),
				{ provide: ResultadoService, useValue: resultadoServiceSpy },
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: LaboratorioService, useValue: labServiceSpy },
				{ provide: Router, useValue: routerSpy },
				{ provide: ActivatedRoute, useValue: activatedRouteMock }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ResultadoFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should create a new result', () => {
		resultadoServiceSpy.create.and.returnValue(of({ id: 1, analisis: 'ok', fecha: new Date() }));
		component.isEditMode = false;

		component.onSubmit();

		expect(resultadoServiceSpy.create).toHaveBeenCalled();
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/resultados']);
	});

	it('should update an existing result', () => {
		component.isEditMode = true;
		component.resultado = { id: 123, analisis: 'Editado', fecha: new Date() };
		resultadoServiceSpy.update.and.returnValue(of(component.resultado));

		component.onSubmit();

		expect(resultadoServiceSpy.update).toHaveBeenCalledWith(123, component.resultado);
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/resultados']);
	});

	it('should load resultado in edit mode', () => {
		const mockResult = { id: 5, analisis: 'Test', fecha: new Date() };
		resultadoServiceSpy.getById.and.returnValue(of(mockResult));

		component.loadResultado(5);

		expect(resultadoServiceSpy.getById).toHaveBeenCalledWith(5);
		expect(component.resultado).toEqual(mockResult);
	});

	it('should handle error when loading resultado', () => {
		resultadoServiceSpy.getById.and.returnValue(throwError(() => new Error('Load Error')));

		component.loadResultado(5);

		expect(component.error).toBe('Error al cargar resultado');
	});

	it('should handle error when creating resultado', () => {
		resultadoServiceSpy.create.and.returnValue(throwError(() => new Error('Create Error')));
		component.isEditMode = false;

		component.onSubmit();

		expect(component.error).toBe('Error al crear resultado');
		expect(component.loading).toBeFalse();
	});

	it('should handle error when updating resultado', () => {
		component.isEditMode = true;
		component.resultado = { id: 123, analisis: 'Editado', fecha: new Date() };
		resultadoServiceSpy.update.and.returnValue(throwError(() => new Error('Update Error')));

		component.onSubmit();

		expect(component.error).toBe('Error al actualizar resultado');
		expect(component.loading).toBeFalse();
	});

	it('should compare objects correctly', () => {
		expect(component.compareObjects({ id: 1 }, { id: 1 })).toBeTrue();
		expect(component.compareObjects({ id: 1 }, { id: 2 })).toBeFalse();
		expect(component.compareObjects(null, null)).toBeTrue();
		expect(component.compareObjects(null, { id: 1 })).toBeFalse();
	});
});
