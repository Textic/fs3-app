import { TestBed } from '@angular/core/testing';
import { ResultadoService } from './resultado';
import { AuthService } from './auth';
import { provideHttpClient, HttpHeaders } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Resultado } from '../models';

describe('ResultadoService', () => {
	let service: ResultadoService;
	let httpMock: HttpTestingController;
	let authServiceSpy: jasmine.SpyObj<AuthService>;

	beforeEach(() => {
		authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
		authServiceSpy.getAuthHeaders.and.returnValue(new HttpHeaders());

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: AuthService, useValue: authServiceSpy }
			]
		});
		service = TestBed.inject(ResultadoService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should get all resultados', () => {
		const mockResults: Resultado[] = [{ id: 1, analisis: 'Test', fecha: new Date() }];

		service.getAll().subscribe(results => {
			expect(results.length).toBe(1);
		});

		const req = httpMock.expectOne('/api/resultados');
		expect(req.request.method).toBe('GET');
		req.flush(mockResults);
	});

	it('should get resultado by id', () => {
		const mockResult: Resultado = { id: 1, analisis: 'Test', fecha: new Date() };

		service.getById(1).subscribe(result => {
			expect(result.id).toBe(1);
			expect(result.analisis).toBe('Test');
		});

		const req = httpMock.expectOne('/api/resultados/1');
		expect(req.request.method).toBe('GET');
		req.flush(mockResult);
	});

	it('should create resultado', () => {
		const newResult: Resultado = { analisis: 'NewTest', fecha: new Date() };
		const mockResponse: Resultado = { id: 2, ...newResult };

		service.create(newResult).subscribe(result => {
			expect(result.id).toBe(2);
			expect(result.analisis).toBe('NewTest');
		});

		const req = httpMock.expectOne('/api/resultados');
		expect(req.request.method).toBe('POST');
		req.flush(mockResponse);
	});

	it('should update resultado', () => {
		const updatedResult: Resultado = { id: 1, analisis: 'UpdatedTest', fecha: new Date() };

		service.update(1, updatedResult).subscribe(result => {
			expect(result.analisis).toBe('UpdatedTest');
		});

		const req = httpMock.expectOne('/api/resultados/1');
		expect(req.request.method).toBe('PUT');
		req.flush(updatedResult);
	});

	it('should delete resultado', () => {
		service.delete(1).subscribe(response => {
			expect(response).toBeTruthy();
		});

		const req = httpMock.expectOne('/api/resultados/1');
		expect(req.request.method).toBe('DELETE');
		req.flush({});
	});

	it('should get resultados by paciente', () => {
		const mockResults: Resultado[] = [
			{ id: 1, analisis: 'Test1', fecha: new Date() },
			{ id: 2, analisis: 'Test2', fecha: new Date() }
		];

		service.getByPaciente(5).subscribe(results => {
			expect(results.length).toBe(2);
		});

		const req = httpMock.expectOne('/api/resultados/paciente/5');
		expect(req.request.method).toBe('GET');
		req.flush(mockResults);
	});
});
