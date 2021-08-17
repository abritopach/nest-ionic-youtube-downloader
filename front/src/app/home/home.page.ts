// Angular
import { Component, ElementRef, ViewChild } from '@angular/core';

// Ionic
import { ActionSheetController, Animation, AnimationController, LoadingController } from '@ionic/angular';

// Rxjs
import { firstValueFrom } from 'rxjs';

// Third parties
import { saveAs } from 'file-saver';
import { TranslocoService } from '@ngneat/transloco';

/* Project */

// Models
import { ACCEPT_MIME_TYPES, FormatType } from '@models/format.model';
import { IVideoInfo } from '@models/video.model';

// Services
import { ApiService } from '@services/api/api.service';
import { ConvertToMp3Service } from '@services/mp3/convert-to-mp3.service';
import { DriveService } from '@services/gapi/drive/drive.service';
import { DropboxService } from '@services/dropbox/dropbox.service';

// Utils
import { convertAudioBlobToBase64, convertBlobToString, handlePromise, isValidYouTubeVideoUrl } from '@utils/utils';

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
                private driveService: DriveService,
                private loadingCtrl: LoadingController,
                private dropboxService: DropboxService) {}

    ionViewDidEnter() {
        if (this.dropboxService.hasRedirectedFromAuth()) {
            this.uploadToDropbox();
        }
    }

    async uploadToDropbox() {
        this.showLoading();
        await this.dropboxService.getToken();
        const videoInfo = {
            name: window.sessionStorage.getItem('name'),
            file: window.sessionStorage.getItem('file'),
            mimeType: window.sessionStorage.getItem('mimeType')
        };
        const [uploadResult, uploadError] = await handlePromise(this.dropboxService.uploadVideoOrAudio(videoInfo))
        console.log('upload dropbox result', uploadResult);
        window.sessionStorage.clear();
        this.hideLoading();
    }

    async downloadYoutubeVideo() {
        console.log('HomePage::downloadYoutubeVideo method called', this.videoInfo);

        const [checkVideoResult, checkVideoError] = await handlePromise(firstValueFrom(this.apiService.checkVideo({url: this.videoInfo.url})));
        console.log('checkVideoResult', checkVideoResult);
        const { data: checkVideoData } = checkVideoResult;

        /*
        const [downloadVideoResult, downloadVideoError] = await handlePromise(firstValueFrom(this.apiService.downloadAndConvertVideo(this.videoInfo)));
        console.log('downloadVideoResult', downloadVideoResult);
        const { data: downloadVideoData} = downloadVideoResult;
        if (downloadVideoData) {
            const blob = new Blob([new Uint8Array(downloadVideoData['data'])], { type: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
            saveAs(blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
        }
        */

        const [downloadVideoResult, downloadVideoError] = await handlePromise(firstValueFrom(this.apiService.downloadVideo(this.videoInfo)));
        console.log('downloadVideoResult', downloadVideoResult);
        const { data: downloadVideoData} = downloadVideoResult;
        if (downloadVideoData) {
            const blob = new Blob([new Uint8Array(downloadVideoData['data'])], { type: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
            if (this.videoInfo.format === FormatType.mp4) {
                saveAs(blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
                this.presentActionSheet({name: checkVideoData.title, file: blob, mimeType: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
            }
            else {
                const mp3Blob = await this.convertToMp3Service.convertToMP3(blob);
                saveAs(mp3Blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
                this.presentActionSheet({name: checkVideoData.title, file: mp3Blob, mimeType: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
            }
        }

        this.stopDownloadingAnimation();
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

    async presentActionSheet(videoInfo?: {name: string, file: Blob, mimeType: string}) {
        const actionSheet = await this.actionSheetController.create({
            header: this.translocoService.translate('pages.home.actionSheet.header'),
            buttons: [{
                text: this.translocoService.translate('pages.home.actionSheet.optionUploadDrive'),
                icon: 'logo-google',
                handler: async () => {
                    console.log('Upload to Google Drive clicked', videoInfo);
                    await this.showLoading();
                    const [uploadResult, uploadError] = await handlePromise(this.driveService.uploadVideoOrAudio(videoInfo));
                    console.log('upload drive result', uploadResult);
                    this.hideLoading();
                }
            },
            {
                text: this.translocoService.translate('pages.home.actionSheet.optionUploadDropbox'),
                icon: 'logo-dropbox',
                handler: async () => {
                    console.log('Upload to Dropbox clicked', videoInfo);
                    window.sessionStorage.setItem("file", await convertAudioBlobToBase64(videoInfo.file));
                    window.sessionStorage.setItem("mimeType", videoInfo.mimeType);
                    window.sessionStorage.setItem("name", videoInfo.name);
                    await this.dropboxService.doAuth();
                }
            },
            {
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

    async showLoading() {
        try {
            this.loading = await this.loadingCtrl.create(
                {
                    message: 'Please wait...uploading file',
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
