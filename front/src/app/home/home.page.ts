// Angular
import { Component } from '@angular/core';

// Ionic
import { LoadingController } from '@ionic/angular';

// Third parties
import { saveAs } from 'file-saver';

/* Project */

// Models
import { ACCEPT_MIME_TYPES, FormatType } from '@models/format.model';
import { IVideoInfo } from '@models/video.model';

// Services
import { ApiService } from '@services/api/api.service';
import { ConvertToMp3Service } from '@services/mp3/convert-to-mp3.service';
import { handlePromise, isValidYouTubeVideoUrl } from '@utils/utils';

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
        format: FormatType.mp3
    };
    loading: HTMLIonLoadingElement;
    isValidYouTubeVideoUrl = isValidYouTubeVideoUrl;

    constructor(private apiService: ApiService, private loadingCtrl: LoadingController,
                private convertToMp3Service: ConvertToMp3Service) {}

    async downloadYoutubeVideo() {
        console.log('HomePage::downloadYoutubeVideo method called', this.videoInfo);
        this.showLoading();

        const [checkVideoResult, checkVideoError] = await handlePromise(this.apiService.checkVideo({url: this.videoInfo.url}).toPromise());
        console.log('checkVideoResult', checkVideoResult);
        const { data: checkVideoData } = checkVideoResult;

        /*
        const [downloadVideoResult, downloadVideoError] = await handlePromise(this.apiService.downloadAndConvertVideo(this.videoInfo).toPromise());
        console.log('downloadVideoResult', downloadVideoResult);
        const { data: downloadVideoData} = downloadVideoResult;
        if (downloadVideoData) {
            const blob = new Blob([new Uint8Array(downloadVideoData['data'])], { type: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
            saveAs(blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
        }
        */

        const [downloadVideoResult, downloadVideoError] = await handlePromise(this.apiService.downloadVideo(this.videoInfo).toPromise());
        console.log('downloadVideoResult', downloadVideoResult);
        const { data: downloadVideoData} = downloadVideoResult;
        if (downloadVideoData) {
            const blob = new Blob([new Uint8Array(downloadVideoData['data'])], { type: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
            if (this.videoInfo.format === FormatType.mp4) {
                saveAs(blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
            }
            else {
                const mp3Blob = await this.convertToMp3Service.convertToMP3(blob);
                saveAs(mp3Blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
            }
        }

        this.hideLoading();
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
