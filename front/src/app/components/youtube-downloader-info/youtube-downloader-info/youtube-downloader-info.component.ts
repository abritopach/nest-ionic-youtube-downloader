import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-youtube-downloader-info',
  templateUrl: './youtube-downloader-info.component.html',
  styleUrls: ['./youtube-downloader-info.component.scss'],
})
export class YoutubeDownloaderInfoComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

}
