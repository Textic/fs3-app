import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResultadoListComponent } from './resultado-list';
import { ResultadoService } from '../../services/resultado';
import { of, throwError, Subject, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Resultado } from '../../models';

describe('ResultadoListComponent', () => {
	let component: ResultadoListComponent;
	let fixture: ComponentFixture<ResultadoListComponent>;
	let resultadoServiceSpy: jasmine.SpyObj<ResultadoService>;

	beforeEach(async () => {
		resultadoServiceSpy = jasmine.createSpyObj('ResultadoService', ['getAll', 'delete']);
		// Usamos un Subject inicial para controlar la carga del ngOnInit manualmente
		const subject = new Subject<Resultado[]>();
		resultadoServiceSpy.getAll.and.returnValue(subject.asObservable());

		await TestBed.configureTestingModule({
			imports: [ResultadoListComponent],
			providers: [
				provideHttpClient(),
				{ provide: ResultadoService, useValue: resultadoServiceSpy },
				{ provide: ActivatedRoute, useValue: {} }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ResultadoListComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should load results on init', fakeAsync(() => {
		// Configuración para este test
		const mockData: Resultado[] = [{ id: 1, analisis: 'Test', fecha: new Date() }];
		resultadoServiceSpy.getAll.and.returnValue(of(mockData).pipe(delay(1)));

		component.ngOnInit(); // Disparamos init
		fixture.detectChanges();
		expect(component.loading).toBeTrue(); // Debe empezar cargando

		tick(1); // Avanzamos el tiempo para que responda el delay(1)
		fixture.detectChanges(); // Actualizamos la vista

		expect(component.loading).toBeFalse(); // Debe terminar de cargar
		expect(component.resultados.length).toBe(1);
	}));

	it('should handle error when loading results', fakeAsync(() => {
		resultadoServiceSpy.getAll.and.returnValue(timer(1).pipe(switchMap(() => throwError(() => new Error('API Error')))));
		spyOn(console, 'error');

		fixture.detectChanges();

		tick(1); // Esperamos el error
		fixture.detectChanges();

		expect(component.error).toContain('Error al cargar resultados');
		expect(component.loading).toBeFalse();
	}));

	// --- AQUÍ ESTABA EL ERROR CORREGIDO ---
	it('should delete result if confirmed', fakeAsync(() => {
		// Inicializar datos directamente en el componente
		component.resultados = [{ id: 1, analisis: 'Test', fecha: new Date() }];
		fixture.detectChanges();

		// Devolvemos objeto vacío o null, ya que delete retorna Observable<any>
		resultadoServiceSpy.delete.and.returnValue(of({}));

		// 1. Open modal
		component.deleteResultado(1);
		expect(component.showModal).toBeTrue();
		expect(component.resultToDelete).toBe(1);

		// 2. Confirm
		component.confirmDelete();

		expect(resultadoServiceSpy.delete).toHaveBeenCalledWith(1);
		expect(component.resultados.length).toBe(0); // Ahora debe estar vacío
		expect(component.showModal).toBeFalse();
	}));

	it('should NOT delete result if cancelled', () => {
		fixture.detectChanges();
		component.deleteResultado(1);
		expect(resultadoServiceSpy.delete).not.toHaveBeenCalled();

		component.closeModal();
		expect(resultadoServiceSpy.delete).not.toHaveBeenCalled();
		expect(component.showModal).toBeFalse();
	});

	it('should handle delete error', fakeAsync(() => {
		fixture.detectChanges();
		spyOn(window, 'alert');
		resultadoServiceSpy.delete.and.returnValue(throwError(() => new Error('Delete Error')));

		component.deleteResultado(1);
		component.confirmDelete();

		expect(resultadoServiceSpy.delete).toHaveBeenCalledWith(1);
		expect(window.alert).toHaveBeenCalledWith('Error al eliminar resultado');
		expect(component.showModal).toBeFalse();
	}));

	it('should do nothing if id is undefined', () => {
		fixture.detectChanges();
		spyOn(window, 'confirm');
		component.deleteResultado(undefined);
		expect(window.confirm).not.toHaveBeenCalled();
		expect(resultadoServiceSpy.delete).not.toHaveBeenCalled();
	});
});