import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasPage } from './ventas.page';

describe('VentasPage', () => {
  let component: VentasPage;
  let fixture: ComponentFixture<VentasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
