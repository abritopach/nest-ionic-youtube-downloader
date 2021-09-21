// Angular
import { Component, ElementRef, ViewChild } from '@angular/core';

// Ionic
import { ActionSheetController, AlertController, Animation, AnimationController, LoadingController,
    ModalController, PopoverController} from '@ionic/angular';

// Rxjs
import { firstValueFrom } from 'rxjs';

// Third parties
import { saveAs } from 'file-saver';
import { TranslocoService } from '@ngneat/transloco';

/* Project */

// Models
import { ACCEPT_MIME_TYPES, FormatType } from '@models/format.model';
import { IVideoCheckResponse, IVideoDownloadedData, IVideoInfo } from '@models/video.model';

// Services
import { ApiService } from '@services/api/api.service';
import { ConvertToMp3Service } from '@services/mp3/convert-to-mp3.service';
import { DriveService } from '@services/cloud/gapi/drive/drive.service';
import { DropboxService } from '@services/cloud/dropbox/dropbox.service';

// Utils
import { convertAudioBlobToBase64, excludedYoutubeVideoUrls, handlePromise, isValidYouTubeVideoUrl } from '@utils/utils';
import { StorageService } from '@services/storage/storage.service';

// Components
import { YoutubeDownloaderInfoComponent }
from '../components/youtube-downloader-info/youtube-downloader-info/youtube-downloader-info.component';
import { MoreOptionsComponent } from '../components/more-options/more-options/more-options.component';
import { MoreOptions, MoreOptionsPopover } from '@models/option.model';
import { CopyrightClaimsComponent } from '../components/copyright-claims/copyright-claims/copyright-claims.component';
import { OnedriveService } from '@services/cloud/onedrive/onedrive.service';

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
    videoTitle: string = null;
    thumbnailUrl: string = null;

    constructor(private apiService: ApiService,
                private convertToMp3Service: ConvertToMp3Service,
                private animationCtrl: AnimationController,
                private actionSheetController: ActionSheetController,
                private translocoService: TranslocoService,
                private driveService: DriveService,
                private loadingCtrl: LoadingController,
                private dropboxService: DropboxService,
                private storageService: StorageService,
                private alertController: AlertController,
                private modalController: ModalController,
                private popoverController: PopoverController,
                private onedriveService: OnedriveService) {}

    async ionViewDidEnter() {
        this.presentActionSheet();
        const cloudService = await this.storageService.get('cloudService');
        if (cloudService === 'dropbox' && this.dropboxService.hasRedirectedFromAuth()) {
            this.uploadToDropbox();
        }
        /*
        if (cloudService === 'onedrive' && this.onedriveService.hasRedirectedFromAuth()) {
            const videoInfo = {
                name: '',
                file: await this.storageService.get('file'),
                mimeType: ''
            };
            this.onedriveService.uploadVideoOrAudio(videoInfo);
        }
        */
    }

    async uploadToDropbox() {
        this.showLoading();
        await this.dropboxService.getToken();
        const videoInfo = {
            name: await this.storageService.get('name'),
            file: await this.storageService.get('file'),
            mimeType: await this.storageService.get('mimeType')
        };
        const [uploadResult, uploadError] = await handlePromise(this.dropboxService.uploadVideoOrAudio(videoInfo));
        console.log('upload dropbox result', uploadResult);
        await this.storageService.remove('name');
        await this.storageService.remove('mimeType');
        await this.storageService.remove('file');
        this.hideLoading();
        if (uploadError) {
            this.presentAlert({header: 'Upload audio | video to dropbox', message: 'Error uploading audio | video to dropbox'});
        }
    }

    async downloadYoutubeVideo() {
        console.log('HomePage::downloadYoutubeVideo method called', this.videoInfo);
        const condition = (url: string) => url === this.videoInfo.url;
        if (excludedYoutubeVideoUrls().some(condition)) {
            this.presentAlert({header: this.translocoService.translate('pages.home.alert.excludedVideo.title'),
            message: this.translocoService.translate('pages.home.alert.excludedVideo.message')});
            this.stopDownloadingAnimation();
        } else {

            const [checkVideoResult, checkVideoError] = await handlePromise(firstValueFrom(
                this.apiService.checkVideo({url: this.videoInfo.url})
            ));
            console.log('checkVideoResult', checkVideoResult);
            const checkVideoData = checkVideoResult.data as IVideoCheckResponse;

            this.thumbnailUrl = checkVideoData.thumbnails[checkVideoData.thumbnails.length - 1].url;
            this.videoTitle = checkVideoData.title;

            /*
            const [downloadVideoResult, downloadVideoError] = await handlePromise(firstValueFrom(
                this.apiService.downloadAndConvertVideo(this.videoInfo)
            ));
            console.log('downloadVideoResult', downloadVideoResult);
            const { data: downloadVideoData} = downloadVideoResult;
            if (downloadVideoData) {
                const blob = new Blob([new Uint8Array(downloadVideoData['data'])],
                { type: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
                saveAs(blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
            }
            */

            const [downloadVideoResult, downloadVideoError] = await handlePromise(firstValueFrom(
                this.apiService.downloadVideo(this.videoInfo)
            ));
            console.log('downloadVideoResult', downloadVideoResult);
            const downloadVideoData = downloadVideoResult.data as IVideoDownloadedData;
            if (downloadVideoData) {
                const blob = new Blob([new Uint8Array(downloadVideoData.data)],
                { type: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
                if (this.videoInfo.format === FormatType.mp4) {
                    saveAs(blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
                    this.presentActionSheet({name: checkVideoData.title, file: blob,
                    mimeType: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
                }
                else {
                    const mp3Blob = await this.convertToMp3Service.convertToMP3(blob);
                    saveAs(mp3Blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
                    this.presentActionSheet({name: checkVideoData.title, file: mp3Blob,
                    mimeType: ACCEPT_MIME_TYPES.get(this.videoInfo.format)});
                }
            }

            this.stopDownloadingAnimation();
        }
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

    async presentActionSheet(videoInfo?: {name: string; file: Blob; mimeType: string}) {
        const actionSheet = await this.actionSheetController.create({
            header: this.translocoService.translate('pages.home.actionSheet.header'),
            buttons: [
            {
                text: this.translocoService.translate('pages.home.actionSheet.optionUploadDrive'),
                icon: 'logo-google',
                handler: async () => {
                    console.log('Upload to Google Drive clicked', videoInfo);
                    await this.showLoading();
                    const [uploadResult, uploadError] = await handlePromise(this.driveService.uploadVideoOrAudio(videoInfo));
                    console.log('upload drive result', uploadResult);
                    console.log('upload error', uploadError);
                    this.hideLoading();
                    if (uploadError) {
                        this.presentAlert({header: 'Upload audio | video to google drive',
                        message: 'Error uploading audio | video to google drive'});
                    }
                }
            },
            {
                text: this.translocoService.translate('pages.home.actionSheet.optionUploadDropbox'),
                icon: 'logo-dropbox',
                handler: async () => {
                    console.log('Upload to Dropbox clicked', videoInfo);
                    this.storageService.set('cloudService', 'dropbox');
                    this.storageService.set('file', await convertAudioBlobToBase64(videoInfo.file));
                    this.storageService.set('mimeType', videoInfo.mimeType);
                    this.storageService.set('name', videoInfo.name);
                    await this.dropboxService.doAuth();
                }
            },
            /*
            {
                text: this.translocoService.translate('pages.home.actionSheet.optionUploadOneDrive'),
                icon: 'logo-microsoft',
                handler: async () => {
                    console.log('Upload to onedrive clicked', videoInfo);
                    this.storageService.set('cloudService', 'onedrive');
                    // await this.onedriveService.uploadVideoOrAudio(videoInfo);
                    await this.onedriveService.doAuth();
                }
            },
            */
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

    async presentAlert(alertData: {header: string; message: string}) {
        const alert = await this.alertController.create({
            header: alertData.header,
            message: alertData.message,
            buttons: ['OK']
        });
        await alert.present();
    }

    onClearSearchHandler() {
        console.log('onClickSearchHandler');
        this.thumbnailUrl = null;
        this.videoTitle = null;
    }

    onClickBuyMeCoffeeHandler() {
        window.open('https://www.buymeacoffee.com/h6WVj4HcD', '_blank');
    }

    async presentYoutubeDownloaderInfoModal() {
        const modal = await this.modalController.create({
            component: YoutubeDownloaderInfoComponent,
        });
        // modal.style.cssText = '--height: 600px;';
        return await modal.present();
    }

    async presentMoreOptionsPopover(ev: any) {
        const options: MoreOptionsPopover = [
            {text: this.translocoService.translate('components.moreOptions.copyrightClaims'),
            type: MoreOptions.COPYRIGHT_CLAIMS, icon: 'clipboard-outline', show: true}
        ];

        const componentProps = { popoverProps: { options } };
        const popover = await this.popoverController.create({
            component: MoreOptionsComponent,
            event: ev,
            translucent: true,
            componentProps
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();
        console.log('onDidDismiss resolved with data', data);

        if (data?.option.value === MoreOptions.COPYRIGHT_CLAIMS) {
            this.presentCopyrightClaimsModal();
        }
    }

    async presentCopyrightClaimsModal() {
        const modal = await this.modalController.create({
            component: CopyrightClaimsComponent,
        });
        return await modal.present();
    }

}
