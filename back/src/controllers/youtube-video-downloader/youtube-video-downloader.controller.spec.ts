import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeVideoDownloaderController } from './youtube-video-downloader.controller';

describe('YoutubeVideoDownloaderController', () => {
  let controller: YoutubeVideoDownloaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoutubeVideoDownloaderController],
    }).compile();

    controller = module.get<YoutubeVideoDownloaderController>(
      YoutubeVideoDownloaderController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
