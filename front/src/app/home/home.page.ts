import { Component } from '@angular/core';
import { FormatType } from '../models/format.model';
import { IVideoInfo } from '../models/video-infot.model';
import { ApiService } from '../services/api/api.service';
import { saveAs } from 'file-saver';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    currentYear = new Date().getFullYear();
    format = FormatType;
    videoInfo: IVideoInfo = {
        url: '',
        format: FormatType.MP3
    };
    loading: HTMLIonLoadingElement;

    constructor(private apiService: ApiService, private loadingCtrl: LoadingController) {}

    downloadYoutubeVideo() {
        console.log('HomePage::downloadYoutubeVideo method called', this.videoInfo);

        /*
        this.apiService.checkVideo({url: this.videoInfo.url}).subscribe(result => {
            console.log('checkVideo result', result);
        })
        */

        this.showLoading();
        this.apiService.downloadVideo(this.videoInfo).subscribe(result => {
            console.log('result', result);
            // this.downloadFile(result.data.data, 'video/mp4');
            let blob = new Blob([new Uint8Array(result.data.data)], { type: 'video/mp4'});
            saveAs(blob, `video.mp4`);
            this.hideLoading();
        })
    }

    videoFormatChanged(event: any) {
        console.log('HomePage::videoFormatChanged method called', event.detail.value);
        this.videoInfo.format = event.detail.value;
    }

    async showLoading() {
        try {
            this.loading = await this.loadingCtrl.create(
                {
                    message: 'Please wait...',
                    translucent: true,
                }
            );
            await this.loading.present();
        } catch (error) {
            console.log(error);
        }
    }

    hideLoading() {
        this.loading.dismiss();
    }

}
