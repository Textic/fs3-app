import { TestBed } from '@angular/core/testing';
import { LaboratorioService } from './laboratorio';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Laboratorio } from '../models';

describe('LaboratorioService', () => {
  let service: LaboratorioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LaboratorioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all laboratorios', () => {
    const mockLabs: Laboratorio[] = [{ id: 1, nombre: 'Lab1', direccion: 'Dir1', telefono: 'Tel1' }];

    service.getAll().subscribe(labs => {
      expect(labs.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/laboratorios');
    expect(req.request.method).toBe('GET');
    req.flush(mockLabs);
  });
});
