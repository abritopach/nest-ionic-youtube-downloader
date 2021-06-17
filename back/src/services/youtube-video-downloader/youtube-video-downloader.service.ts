import { Injectable } from '@nestjs/common';

@Injectable()
export class YoutubeVideoDownloaderService {
  downloadYoutubeVideo(): string {
    return 'Get youtube video!';
  }
}
