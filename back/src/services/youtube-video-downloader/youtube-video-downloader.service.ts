import { Injectable } from '@nestjs/common';

@Injectable()
export class YoutubeVideoDownloaderService {
  downloadYoutubeVideo(): any { // TODO: Update response type
    return { status: 'OK', message: 'Get youtube video!', data: null};
  }
}
