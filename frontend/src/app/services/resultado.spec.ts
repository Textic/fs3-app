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
});
