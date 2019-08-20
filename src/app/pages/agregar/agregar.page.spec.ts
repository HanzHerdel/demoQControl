import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AgregarPage } from './agregar.page';

describe('AgregarPage', () => {
  let component: AgregarPage;
  let fixture: ComponentFixture<AgregarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = await TestBed.createComponent(AgregarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
