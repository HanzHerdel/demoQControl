import { TestBed } from '@angular/core/testing';

import { DescargasService } from './descargas.service';

describe('DescargasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DescargasService = TestBed.get(DescargasService);
    expect(service).toBeTruthy();
  });
});
