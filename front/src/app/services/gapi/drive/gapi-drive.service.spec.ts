import { TestBed } from '@angular/core/testing';

import { GapiDriveService } from './gapi-drive.service';

describe('GapiDriveService', () => {
  let service: GapiDriveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GapiDriveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
