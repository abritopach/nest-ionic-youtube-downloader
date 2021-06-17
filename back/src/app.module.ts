import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeVideoDownloaderController } from './controllers/youtube-video-downloader/youtube-video-downloader.controller';
import { YoutubeVideoDownloaderService } from './services/youtube-video-downloader/youtube-video-downloader.service';

@Module({
  imports: [],
  controllers: [AppController, YoutubeVideoDownloaderController],
  providers: [AppService, YoutubeVideoDownloaderService],
})
export class AppModule {}
