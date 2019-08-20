import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoDinamicoComponent } from './campo-dinamico.component';

describe('CampoDinamicoComponent', () => {
  let component: CampoDinamicoComponent;
  let fixture: ComponentFixture<CampoDinamicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampoDinamicoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampoDinamicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
