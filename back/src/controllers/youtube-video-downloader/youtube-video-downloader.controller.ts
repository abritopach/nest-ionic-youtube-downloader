import { Body, Controller, Post } from '@nestjs/common';
import { VideoInfoDto } from 'src/dtos/video-info.dto';
import { YoutubeVideoDownloaderService } from 'src/services/youtube-video-downloader/youtube-video-downloader.service';

@Controller('youtube-video-downloader')
export class YoutubeVideoDownloaderController {
  constructor(
    private readonly youtubeVideoDownloaderService: YoutubeVideoDownloaderService,
  ) {}

  @Post('check-video')
  checkYoutubeVideo(@Body('url') URL: string) {
    console.log('checkYoutubeVideo url', URL);
    return this.youtubeVideoDownloaderService.checkYoutubeVideo(URL);
  }

  @Post('download')
  async downloadYoutubeVideo(@Body() videoInfoDto: VideoInfoDto) {
    console.log('videoInfo', videoInfoDto);
    return await this.youtubeVideoDownloaderService.downloadYoutubeVideo(videoInfoDto);
  }
}
