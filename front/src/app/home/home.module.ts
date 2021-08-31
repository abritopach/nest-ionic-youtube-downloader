import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { NtkmeButtonModule } from '@ctrl/ngx-github-buttons';
import { TranslocoModule } from '@ngneat/transloco';
import { YoutubeDownloaderInfoComponent } from '../components/youtube-downloader-info/youtube-downloader-info/youtube-downloader-info.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NtkmeButtonModule,
    TranslocoModule
  ],
  declarations: [HomePage, YoutubeDownloaderInfoComponent]
})
export class HomePageModule {}
