import { Component } from '@angular/core';
import { FormatType } from '../models/format.model';
import { IVideoInfo } from '../models/video-infot.model';
import { ApiService } from '../services/api/api.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    currentYear = new Date().getFullYear();
    format = FormatType;
    isDownloadButtonClicked = false;
    videoInfo: IVideoInfo = {
        url: '',
        format: FormatType.MP3
    };

    constructor(private apiService: ApiService) {}

    downloadYoutubeVideo() {
        console.log('HomePage::downloadYoutubeVideo method called', this.videoInfo);
        this.apiService.downloadVideo(this.videoInfo).subscribe(result => {
            console.log('result', result);
        })
    }

    videoFormatChanged(event: any) {
        console.log('HomePage::videoFormatChanged method called', event.detail.value);
        this.videoInfo.format = event.detail.value;
    }

}
