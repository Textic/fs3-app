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

  it('should get laboratorio by id', () => {
    const mockLab: Laboratorio = { id: 1, nombre: 'Lab1', direccion: 'Dir1', telefono: 'Tel1' };

    service.getById(1).subscribe(lab => {
      expect(lab.id).toBe(1);
      expect(lab.nombre).toBe('Lab1');
    });

    const req = httpMock.expectOne('/api/laboratorios/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockLab);
  });

  it('should create laboratorio', () => {
    const newLab: Laboratorio = { nombre: 'NewLab', direccion: 'NewDir', telefono: '555-1234' };
    const mockResponse: Laboratorio = { id: 2, ...newLab };

    service.create(newLab).subscribe(lab => {
      expect(lab.id).toBe(2);
      expect(lab.nombre).toBe('NewLab');
    });

    const req = httpMock.expectOne('/api/laboratorios');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLab);
    req.flush(mockResponse);
  });

  it('should update laboratorio', () => {
    const updatedLab: Laboratorio = { id: 1, nombre: 'UpdatedLab', direccion: 'UpdatedDir', telefono: '555-9999' };

    service.update(1, updatedLab).subscribe(lab => {
      expect(lab.nombre).toBe('UpdatedLab');
    });

    const req = httpMock.expectOne('/api/laboratorios/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedLab);
    req.flush(updatedLab);
  });

  it('should delete laboratorio', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeFalsy(); // null or undefined
    });

    const req = httpMock.expectOne('/api/laboratorios/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
