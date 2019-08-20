import { TestBed } from '@angular/core/testing';

import { CamposService } from './campos.service';

describe('CamposService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CamposService = TestBed.get(CamposService);
    expect(service).toBeTruthy();
  });
});
