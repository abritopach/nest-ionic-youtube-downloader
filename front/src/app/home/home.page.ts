import { Component } from '@angular/core';
import { FormatType } from '../models/format.model';
import { ApiService } from '../services/api/api.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    currentYear = new Date().getFullYear();
    format: FormatType;
    isDownloadButtonClicked = false;

    constructor(private apiService: ApiService) {}

    downloadYoutubeVideo() {
        console.log('HomePage::downloadYoutubeVideo method called');
        this.apiService.downloadVideo({}).subscribe(result => {
            console.log('result', result);
        })
    }

}
