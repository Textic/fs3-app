import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorioList } from './laboratorio-list';

describe('LaboratorioList', () => {
  let component: LaboratorioList;
  let fixture: ComponentFixture<LaboratorioList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratorioList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratorioList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
