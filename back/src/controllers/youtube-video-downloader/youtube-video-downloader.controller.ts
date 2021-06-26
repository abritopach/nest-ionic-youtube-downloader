import { Get, Header, Param, Res } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { Response } from 'express';
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
  @Header('Content-Disposition', `attachment; filename=video.mp4`)
  async downloadYoutubeVideo(@Body() videoInfoDto: VideoInfoDto, @Res() res: Response) {
    console.log('videoInfo', videoInfoDto);
    // res.setHeader('Content-Disposition', `attachment; filename=video.mp4`);
    return await this.youtubeVideoDownloaderService.downloadYoutubeVideo(videoInfoDto);
  }
}
