import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { NtkmeButtonModule } from '@ctrl/ngx-github-buttons';
import { TranslocoModule } from '@ngneat/transloco';
import { YoutubeDownloaderInfoComponent } from '../components/youtube-downloader-info/youtube-downloader-info/youtube-downloader-info.component';
import { MoreOptionsComponent } from '../components/more-options/more-options/more-options.component';
import { CopyrightClaimsComponent } from '../components/copyright-claims/copyright-claims/copyright-claims.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NtkmeButtonModule,
    TranslocoModule
  ],
  declarations: [HomePage, YoutubeDownloaderInfoComponent, MoreOptionsComponent, CopyrightClaimsComponent]
})
export class HomePageModule {}
