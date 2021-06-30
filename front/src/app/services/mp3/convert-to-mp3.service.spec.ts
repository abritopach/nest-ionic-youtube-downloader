import { TestBed } from '@angular/core/testing';

import { ConvertToMp3Service } from './convert-to-mp3.service';

describe('ConvertToMp3Service', () => {
  let service: ConvertToMp3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertToMp3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
