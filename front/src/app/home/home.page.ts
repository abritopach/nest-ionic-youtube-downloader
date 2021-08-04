// Angular
import { Component, ElementRef, ViewChild } from '@angular/core';

// Ionic
import { ActionSheetController, Animation, AnimationController } from '@ionic/angular';

// Third parties
import { saveAs } from 'file-saver';

/* Project */

// Models
import { ACCEPT_MIME_TYPES, FormatType } from '@models/format.model';
import { IVideoInfo } from '@models/video.model';

// Services
import { ApiService } from '@services/api/api.service';
import { ConvertToMp3Service } from '@services/mp3/convert-to-mp3.service';

// Utils
import { handlePromise, isValidYouTubeVideoUrl } from '@utils/utils';
import { TranslocoService } from '@ngneat/transloco';
import { GapiAuthServiceService } from '@services/auth/gapi-auth-service.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    @ViewChild('downloadingIcon', { read: ElementRef }) downloadingIcon: ElementRef;
    currentYear = new Date().getFullYear();
    format = FormatType;
    videoInfo: IVideoInfo = {
        url: '',
        format: FormatType.mp3
    };
    loading: HTMLIonLoadingElement;
    isValidYouTubeVideoUrl = isValidYouTubeVideoUrl;
    isDownloadStarted = false;
    downloadingAnimation: Animation;

    constructor(private apiService: ApiService,
                private convertToMp3Service: ConvertToMp3Service,
                private animationCtrl: AnimationController,
                private actionSheetController: ActionSheetController,
                private translocoService: TranslocoService,
                private gapiAuthServiceService: GapiAuthServiceService) {}

    ionViewDidEnter() {
        this.presentActionSheet();
    }

    async downloadYoutubeVideo() {
        console.log('HomePage::downloadYoutubeVideo method called', this.videoInfo);

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

        this.stopDownloadingAnimation();
        // this.presentActionSheet(); TODO: Working in this code.
    }

    videoFormatChanged(event: any) {
        console.log('HomePage::videoFormatChanged method called', event.detail.value);
        this.videoInfo.format = event.detail.value;
    }

    startDownloadingAnimation() {
        this.isDownloadStarted = true;
        this.downloadingAnimation = this.animationCtrl.create('downloading-animation')
            .addElement(this.downloadingIcon.nativeElement)
            .duration(1500)
            .iterations(Infinity)
            .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)');

        this.downloadingAnimation.play();
    }

    stopDownloadingAnimation() {
        this.isDownloadStarted = false;
        this.downloadingAnimation.stop();
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: this.translocoService.translate('pages.home.actionSheet.header'),
            buttons: [{
                text: this.translocoService.translate('pages.home.actionSheet.optionUploadDrive'),
                icon: 'logo-google',
                handler: async () => {
                    console.log('Upload to Google Drive clicked');
                    await this.gapiAuthServiceService.fetchGoogleUser();
                    await this.gapiAuthServiceService.listUserFiles();
                }
            }, {
                text: this.translocoService.translate('pages.home.actionSheet.optionUploadDropbox'),
                icon: 'logo-dropbox',
                handler: () => {
                    console.log('Upload to Dropbox clicked');
                }
            }, {
                text: this.translocoService.translate('pages.home.actionSheet.optionCancel'),
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
            });
        await actionSheet.present();

        const { role } = await actionSheet.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
    }

}
