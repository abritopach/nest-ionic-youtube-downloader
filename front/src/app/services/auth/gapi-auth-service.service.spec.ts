import { TestBed } from '@angular/core/testing';

import { GapiAuthServiceService } from './gapi-auth-service.service';

describe('GapiAuthServiceService', () => {
  let service: GapiAuthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GapiAuthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
