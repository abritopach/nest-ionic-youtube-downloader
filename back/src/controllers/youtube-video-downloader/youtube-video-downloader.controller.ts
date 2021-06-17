import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { YoutubeVideoDownloaderService } from 'src/services/youtube-video-downloader/youtube-video-downloader.service';

@Controller('youtube-video-downloader')
export class YoutubeVideoDownloaderController {
  constructor(
    private readonly youtubeVideoDownloaderService: YoutubeVideoDownloaderService,
  ) {}

  @Get('download')
  downloadYoutubeVideo(): string {
    return this.youtubeVideoDownloaderService.downloadYoutubeVideo();
  }
}
