import { TestBed } from '@angular/core/testing';

import { LaboratorioService } from './laboratorio';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LaboratorioService', () => {
  let service: LaboratorioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LaboratorioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
