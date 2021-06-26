import { Injectable } from '@nestjs/common';
import { VideoInfoDto } from 'src/dtos/video-info.dto';
import * as ytdl from 'ytdl-core';
import { createWriteStream } from 'fs';

@Injectable()
export class YoutubeVideoDownloaderService {

  async checkYoutubeVideo(URL: string) {
    try {
      const {
        player_response: {
          videoDetails: { title, author },
        },
      } = await ytdl.getBasicInfo(URL);
      return { status: 'OK', message: 'Youtube video exists!', data: {title, author}};
    } catch (error) {
      console.log('Error', error);
      return { status: 'KO', message: 'Error video does not exist :(', data: null};
    }
  }


  async downloadYoutubeVideo(videoInfoDto: VideoInfoDto) { // TODO: Update response type
    console.log('YoutubeVideoDownloaderService::downloadYoutubeVideo method called');

    return new Promise((resolve, reject) => {
      try {
        let stream = ytdl(videoInfoDto.url);
        let aData = [];

        stream.on('data', (data) => {
          aData.push(data);
        });

        stream.on('end', () => {
          const buffer = Buffer.concat(aData);
          console.log('buffer', buffer);
          resolve({ status: 'OK', message: 'Get youtube video!', data: buffer});
        });
        /*
          .pipe(createWriteStream('video.mp4'))
          .on('end', () => {
            return { status: 'OK', message: 'Get youtube video!', data: null};
          });
        */
      } catch (error) {
        console.log('Error', error);
        reject({ status: 'KO', message: error.message, data: null});
        // return { status: 'KO', message: 'Error getting youtube video :(', data: null};
      }
    })
  }
}
