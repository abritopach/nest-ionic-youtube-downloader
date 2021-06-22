import { Injectable } from '@nestjs/common';
import { VideoInfoDto } from 'src/dtos/video-info.dto';
import ytdl from 'ytdl-core';

@Injectable()
export class YoutubeVideoDownloaderService {
  downloadYoutubeVideo(videoInfoDto: VideoInfoDto): any { // TODO: Update response type

    ytdl(videoInfoDto.url);

    return { status: 'OK', message: 'Get youtube video!', data: null};
  }
}
