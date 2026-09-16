import { TestBed } from '@angular/core/testing';

import { DownloadpdfService } from './downloadpdf-service';

describe('DownloadpdfService', () => {
  let service: DownloadpdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadpdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
