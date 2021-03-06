import { Body, Controller, Post } from '@nestjs/common';
import { VideoInfoDto } from '../../dtos/video-info.dto';
import { YoutubeVideoDownloaderService } from '../../services/youtube-video-downloader/youtube-video-downloader.service';

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

  @Post('download-playlist')
  async downloadYoutubePlaylist(@Body() videoInfoDto: VideoInfoDto) {
    console.log('videoInfo', videoInfoDto);
    return this.youtubeVideoDownloaderService.downloadYoutubePlaylist(
      videoInfoDto,
    );
  }

  @Post('download')
  async downloadYoutubeVideo(@Body() videoInfoDto: VideoInfoDto) {
    console.log('videoInfo', videoInfoDto);
    return this.youtubeVideoDownloaderService.downloadYoutubeVideo(
      videoInfoDto,
    );
  }

  @Post('downloadAndConvert')
  async downloadConvertYoutubeVideo(@Body() videoInfoDto: VideoInfoDto) {
    console.log('videoInfo', videoInfoDto);
    return this.youtubeVideoDownloaderService.downloadConvertYoutubeVideo(
      videoInfoDto,
    );
  }
}
