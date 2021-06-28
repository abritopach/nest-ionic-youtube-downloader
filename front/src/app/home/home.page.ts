import { Component } from '@angular/core';
import { ACCEPT_MIME_TYPES, FormatType } from '../models/format.model';
import { IVideoInfo } from '../models/video.model';
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

    async downloadYoutubeVideo() {
        console.log('HomePage::downloadYoutubeVideo method called', this.videoInfo);
        this.showLoading();
        const checkVideoResult = await this.apiService.checkVideo({url: this.videoInfo.url}).toPromise();
        console.log('checkVideoResult', checkVideoResult);
        const { data: checkVideoData } = checkVideoResult;
        const downloadVideoResult = await this.apiService.downloadVideo(this.videoInfo).toPromise();
        console.log('downloadVideoResult', downloadVideoResult);
        const { data: downloadVideoData} = downloadVideoResult;
        const blob = new Blob([new Uint8Array(downloadVideoData['data'])], { type: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
        saveAs(blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
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

    isValidYouTubeVideoUrl(url: string) {
        console.log('isValidYouTubeVideoUrl', url);
        const youtubeRegExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        console.log(url.match(youtubeRegExp));
        if (url.match(youtubeRegExp)) {
            return true;
        }
        return false;
    }

}
