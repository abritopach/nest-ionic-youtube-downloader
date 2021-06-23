import { Injectable } from '@nestjs/common';
import { VideoInfoDto } from 'src/dtos/video-info.dto';
import * as ytdl from 'ytdl-core';
import { createWriteStream } from 'fs';

@Injectable()
export class YoutubeVideoDownloaderService {
  downloadYoutubeVideo(videoInfoDto: VideoInfoDto): any { // TODO: Update response type
    console.log('YoutubeVideoDownloaderService::downloadYoutubeVideo method called');
    try {
      ytdl(videoInfoDto.url)
        .pipe(createWriteStream('video.flv'))
        .on('finish', () => {
          return { status: 'OK', message: 'Get youtube video!', data: null};
      });
    } catch (error) {
      console.log('Error', error);
      return { status: 'KO', message: 'Error getting youtube video :(', data: null};
    }
  }
}
