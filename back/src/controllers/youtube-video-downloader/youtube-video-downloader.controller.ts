import { Body, Controller, Post } from '@nestjs/common';
import { VideoInfoDto } from 'src/dtos/video-info.dto';
import { YoutubeVideoDownloaderService } from 'src/services/youtube-video-downloader/youtube-video-downloader.service';

@Controller('youtube-video-downloader')
export class YoutubeVideoDownloaderController {
  constructor(
    private readonly youtubeVideoDownloaderService: YoutubeVideoDownloaderService,
  ) {}

  @Post('download')
  downloadYoutubeVideo(@Body() videoInfoDto: VideoInfoDto): string {
    console.log('videoInfo', videoInfoDto);
    return this.youtubeVideoDownloaderService.downloadYoutubeVideo(videoInfoDto);
  }
}
