import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorioFormComponent } from './laboratorio-form';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('LaboratorioFormComponent', () => {
  let component: LaboratorioFormComponent;
  let fixture: ComponentFixture<LaboratorioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratorioFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LaboratorioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
