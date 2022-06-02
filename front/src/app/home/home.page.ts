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
import { VideoCheckResponse, VideoDownloadedData, VideoInfo, YoutubePlaylistResponse } from '@models/video.model';

// Services
import { ApiService } from '@services/api/api.service';
import { ConvertToMp3Service } from '@services/mp3/convert-to-mp3.service';
import { DriveService } from '@services/cloud/gapi/drive/drive.service';
import { DropboxService } from '@services/cloud/dropbox/dropbox.service';

// Utils
import { convertAudioBlobToBase64, excludedYoutubeVideoUrls, handlePromise,
    isAYoutubePlaylistUrl, isValidYouTubeVideoUrl } from '@utils/utils';
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
    videoInfo: VideoInfo = {
        url: '',
        format: FormatType.mp3
    };
    loading: HTMLIonLoadingElement;
    isValidYouTubeVideoUrl = isValidYouTubeVideoUrl;
    isYoutubePlaylistUrl = isAYoutubePlaylistUrl;
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
        const cloudService = await this.storageService.get('cloudService');
        if (cloudService === 'dropbox' && this.dropboxService.hasRedirectedFromAuth()) {
            this.uploadToDropbox();
        }
        if (cloudService === 'onedrive' && this.onedriveService.hasRedirectedFromAuth()) {
            this.uploadToOneDrive();
        }
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
        await this.storageService.remove('name');
        await this.storageService.remove('mimeType');
        await this.storageService.remove('file');
        this.hideLoading();
        if (uploadError) {
            this.presentAlert({header: this.translocoService.translate('pages.home.alert.uploadVideo.title', { service: 'dropbox' }),
            message:  this.translocoService.translate('pages.home.alert.uploadVideo.errorMessage', { service: 'dropbox' })});
        }
    }

    async uploadToOneDrive() {
        this.showLoading();
        const videoInfo = {
            name: await this.storageService.get('name'),
            file: await this.storageService.get('file'),
            mimeType: await this.storageService.get('mimeType')
        };
        const [uploadResult, uploadError] = await handlePromise(this.onedriveService.uploadVideoOrAudio(videoInfo));
        await this.storageService.remove('name');
        await this.storageService.remove('mimeType');
        await this.storageService.remove('file');
        this.hideLoading();
        if (uploadError) {
            this.presentAlert({header: this.translocoService.translate('pages.home.alert.uploadVideo.title', { service: 'onedrive' }),
            message:  this.translocoService.translate('pages.home.alert.uploadVideo.errorMessage', { service: 'onedrive' })});
        }
    }

    async downloadYoutubeVideo(videoInfo: VideoInfo) {
        const condition = (url: string) => url === videoInfo.url;
        if (excludedYoutubeVideoUrls().some(condition)) {
            this.presentAlert({header: this.translocoService.translate('pages.home.alert.excludedVideo.title'),
            message: this.translocoService.translate('pages.home.alert.excludedVideo.message')});
            this.stopDownloadingAnimation();
        } else {

            const [checkVideoResult, checkVideoError] = await handlePromise(firstValueFrom(
                this.apiService.checkVideo({url: videoInfo.url})
            ));
            const checkVideoData = checkVideoResult.data as VideoCheckResponse;

            this.thumbnailUrl = checkVideoData.thumbnails[checkVideoData.thumbnails.length - 1].url;
            this.videoTitle = checkVideoData.title;

            /*
            const [downloadVideoResult, downloadVideoError] = await handlePromise(firstValueFrom(
                this.apiService.downloadAndConvertVideo(videoInfo)
            ));
            const { data: downloadVideoData} = downloadVideoResult;
            if (downloadVideoData) {
                const blob = new Blob([new Uint8Array(downloadVideoData['data'])],
                { type: ACCEPT_MIME_TYPES.get(videoInfo.format)});
                saveAs(blob, `${checkVideoData.title}.${videoInfo.format.toLocaleLowerCase()}`);
            }
            */

            const [downloadVideoResult, downloadVideoError] = await handlePromise(firstValueFrom(
                this.apiService.downloadVideo(videoInfo)
            ));
            const downloadVideoData = downloadVideoResult.data as VideoDownloadedData;
            if (downloadVideoData) {
                const blob = new Blob([new Uint8Array(downloadVideoData.data)],
                { type: ACCEPT_MIME_TYPES.get(videoInfo.format)});
                if (videoInfo.format === FormatType.mp4) {
                    saveAs(blob, `${checkVideoData.title}.${videoInfo.format.toLocaleLowerCase()}`);
                    this.presentActionSheet({name: checkVideoData.title, file: blob,
                    mimeType: ACCEPT_MIME_TYPES.get(videoInfo.format)});
                }
                else {
                    const mp3Blob = await this.convertToMp3Service.convertToMP3(blob);
                    saveAs(mp3Blob, `${checkVideoData.title}.${videoInfo.format.toLocaleLowerCase()}`);
                    this.presentActionSheet({name: checkVideoData.title, file: mp3Blob,
                    mimeType: ACCEPT_MIME_TYPES.get(videoInfo.format)});
                }
            }

            this.stopDownloadingAnimation();
        }
    }

    async downloadYoutubePlaylist(videoInfo: VideoInfo) {
        const [downloadPlaylistResult, downloadPlaylistError] = await handlePromise(firstValueFrom(
            this.apiService.downloadPlaylist(videoInfo)
        ));
        console.log('downloadYoutubePlaylist downloadPlaylistResult', downloadPlaylistResult);
        console.log('downloadYoutubePlaylist downloadPlaylistError', downloadPlaylistError);

        const playlistData = downloadPlaylistResult.data as YoutubePlaylistResponse;

        this.thumbnailUrl = playlistData.playlist.thumbnails[playlistData.playlist.thumbnails.length - 1].url;
        this.videoTitle = playlistData.playlist.title;

        this.presentAlert({header: this.translocoService.translate('pages.home.alert.downloadPlaylist.title'),
        message:  this.translocoService.translate('pages.home.alert.downloadPlaylist.message')});

        /*
        playlistData.playlist.items.forEach(async (item) => {
            const videoInfo: IVideoInfo = {
                url: item.shortUrl,
                format: FormatType.mp3
            };
            await this.downloadYoutubeVideo(videoInfo);
        });
        */

        this.stopDownloadingAnimation();
    }

    videoFormatChanged(event: any) {
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
                    await this.showLoading();
                    const [uploadResult, uploadError] = await handlePromise(this.driveService.uploadVideoOrAudio(videoInfo));
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
                    this.storageService.set('cloudService', 'dropbox');
                    this.storageService.set('file', await convertAudioBlobToBase64(videoInfo.file));
                    this.storageService.set('mimeType', videoInfo.mimeType);
                    this.storageService.set('name', videoInfo.name);
                    await this.dropboxService.doAuth();
                }
            },
            {
                text: this.translocoService.translate('pages.home.actionSheet.optionUploadOneDrive'),
                icon: 'logo-microsoft',
                handler: async () => {
                    this.storageService.set('cloudService', 'onedrive');
                    this.storageService.set('file', await convertAudioBlobToBase64(videoInfo.file));
                    this.storageService.set('mimeType', videoInfo.mimeType);
                    this.storageService.set('name', videoInfo.name);
                    await this.onedriveService.doAuth();
                }
            },
            {
                text: this.translocoService.translate('pages.home.actionSheet.optionCancel'),
                icon: 'close',
                role: 'cancel',
                handler: () => {}
            }]
            });
        await actionSheet.present();

        const { role } = await actionSheet.onDidDismiss();
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
