import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorioListComponent } from './laboratorio-list';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('LaboratorioListComponent', () => {
  let component: LaboratorioListComponent;
  let fixture: ComponentFixture<LaboratorioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratorioListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LaboratorioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
