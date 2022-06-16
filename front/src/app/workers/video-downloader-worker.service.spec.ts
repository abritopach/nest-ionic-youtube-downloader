import { TestBed } from '@angular/core/testing';

import { VideoDownloaderWorkerService } from './video-downloader-worker.service';

describe('VideoDownloaderWorkerService', () => {
  let service: VideoDownloaderWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoDownloaderWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
