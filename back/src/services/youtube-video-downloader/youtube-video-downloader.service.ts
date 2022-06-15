import { Injectable } from '@nestjs/common';
import { VideoInfoDto } from '../../dtos/video-info.dto';
import ytdl = require('ytdl-core');
import ffmpeg = require('fluent-ffmpeg');
import ytpl = require('ytpl');

@Injectable()
export class YoutubeVideoDownloaderService {
  async checkYoutubeVideo(URL: string) {
    try {
      /*
      const videoId = URL.split('v=')[1].substring(0, 11)
      const info = await ytdl.getInfo(videoId);
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      console.log('Formats with only audio');
      console.log(audioFormats);
      */
      const {
        videoDetails: { thumbnails },
        player_response: {
          videoDetails: { title, author },
        },
      } = await ytdl.getBasicInfo(URL);
      return {
        status: 'OK',
        message: 'Youtube video exists!',
        data: { title, author, thumbnails },
      };
    } catch (error) {
      console.log('Error', error);
      return {
        status: 'KO',
        message: 'Error video does not exist :(',
        data: null,
      };
    }
  }

  async downloadYoutubeVideo(videoInfoDto: VideoInfoDto) {
    console.log(
      'YoutubeVideoDownloaderService::downloadYoutubeVideo method called',
    );
    return new Promise((resolve, reject) => {
      try {
        const stream = ytdl(videoInfoDto.url, {
          filter: videoInfoDto.format === 'mp3' ? 'audioonly' : 'audioandvideo',
          quality:
            videoInfoDto.format === 'mp3' ? 'highestaudio' : 'highestvideo',
        });
        const aData = [];

        stream.on('data', (data) => {
          aData.push(data);
        });

        stream.on('end', () => {
          const buffer = Buffer.concat(aData);
          //console.log('buffer', buffer);
          resolve({
            status: 'OK',
            message: 'Get youtube video!',
            data: buffer,
          });
        });
      } catch (error) {
        console.log('Error', error);
        reject({ status: 'KO', message: error.message, data: null });
      }
    });
  }

  async downloadYoutubePlaylist(videoInfoDto: VideoInfoDto) {
    console.log(
      'YoutubeVideoDownloaderService::downloadYoutubePlaylist method called',
    );
    try {
      const youtubeUrl = new URL(videoInfoDto.url);
      const urlParams = new URLSearchParams(youtubeUrl.search);
      const playlist = await ytpl(urlParams.get('list'));
      return {
        status: 'OK',
        message: 'Youtube playlist exists!',
        data: { playlist },
      };
    } catch (error) {
      console.log('Error', error);
      return {
        status: 'KO',
        message: 'Error playlist does not exist :(',
        data: null,
      };
    }
  }

  async downloadConvertYoutubeVideo(videoInfoDto: VideoInfoDto) {
    console.log(
      'YoutubeVideoDownloaderService::downloadConvertYoutubeVideo method called',
    );
    return new Promise((resolve, reject) => {
      try {
        const audio = ytdl(videoInfoDto.url, {
          filter: 'audioonly',
          quality: 'highestaudio',
        });

        // Convert audio to mp3 format
        const command = ffmpeg(audio)
          .audioCodec('libmp3lame')
          .audioBitrate(128)
          .toFormat('mp3')
          .on('error', (err) => {
            console.log(
              'An error occurred while trying to convert the audio to mp3: ' +
                err.message,
            );
            reject({ status: 'KO', message: err.message, data: null });
          })
          .on('end', () => {
            console.log('Audio file converted to mp3 format');
            resolve({
              status: 'OK',
              message: 'Get youtube video!',
              data: null,
            });
          });

        const aData = [];
        let buffer: Buffer = null;
        const stream = command.pipe();
        stream.on('data', (data) => {
          //console.log('ffmpeg just wrote ' + data.length + ' bytes');
          aData.push(data);
        });

        stream.on('end', () => {
          buffer = Buffer.concat(aData);
          //console.log('buffer', buffer);
        });

        stream.on('close', () => {
          resolve({
            status: 'OK',
            message: 'Get youtube video!',
            data: buffer,
          });
        });
      } catch (error) {
        console.log('Error', error);
        reject({ status: 'KO', message: error.message, data: null });
      }
    });
  }
}
