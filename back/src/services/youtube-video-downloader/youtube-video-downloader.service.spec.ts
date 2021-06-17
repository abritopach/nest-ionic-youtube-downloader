import { Test, TestingModule } from '@nestjs/testing';
import { VideoYoutubeDownloaderService } from './video-youtube-downloader.service';

describe('VideoYoutubeDownloaderService', () => {
  let service: VideoYoutubeDownloaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoYoutubeDownloaderService],
    }).compile();

    service = module.get<VideoYoutubeDownloaderService>(
      VideoYoutubeDownloaderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
