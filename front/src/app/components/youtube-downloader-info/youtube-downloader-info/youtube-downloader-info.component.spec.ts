import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YoutubeDownloaderInfoComponent } from './youtube-downloader-info.component';

describe('YoutubeDownloaderInfoComponent', () => {
  let component: YoutubeDownloaderInfoComponent;
  let fixture: ComponentFixture<YoutubeDownloaderInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeDownloaderInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YoutubeDownloaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
