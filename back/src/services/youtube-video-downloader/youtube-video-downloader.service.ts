import { Injectable } from '@nestjs/common';
import { VideoInfoDto } from 'src/dtos/video-info.dto';
import * as ytdl from 'ytdl-core';

@Injectable()
export class YoutubeVideoDownloaderService {

  async checkYoutubeVideo(URL: string) {
    try {
      /*
      const videoId = URL.split("v=")[1].substring(0, 11)
      const info = await ytdl.getInfo(videoId);
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      console.log('Formats with only audio');
      console.log(audioFormats);
      */
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


  async downloadYoutubeVideo(videoInfoDto: VideoInfoDto) {
    console.log('YoutubeVideoDownloaderService::downloadYoutubeVideo method called');
    return new Promise((resolve, reject) => {
      try {
        let stream = ytdl(videoInfoDto.url, {
          filter: videoInfoDto.format === 'mp3' ? 'audioonly' : 'audioandvideo',
          quality: videoInfoDto.format === 'mp3' ? 'highestaudio' : 'highestvideo',
        });
        let aData = [];

        stream.on('data', (data) => {
          aData.push(data);
        });

        stream.on('end', () => {
          const buffer = Buffer.concat(aData);
          console.log('buffer', buffer);
          resolve({ status: 'OK', message: 'Get youtube video!', data: buffer});
        });
      } catch (error) {
        console.log('Error', error);
        reject({ status: 'KO', message: error.message, data: null});
      }
    })
  }
}
