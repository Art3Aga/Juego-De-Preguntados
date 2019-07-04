import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoPage } from './resultado.page';

describe('ResultadoPage', () => {
  let component: ResultadoPage;
  let fixture: ComponentFixture<ResultadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
