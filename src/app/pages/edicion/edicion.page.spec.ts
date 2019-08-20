import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionPage } from './edicion.page';

describe('EdicionPage', () => {
  let component: EdicionPage;
  let fixture: ComponentFixture<EdicionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdicionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
