import { Component } from '@angular/core';
import { ACCEPT_MIME_TYPES, FormatType } from '../models/format.model';
import { IVideoCheckResponse, IVideoInfo } from '../models/video.model';
import { ApiService } from '../services/api/api.service';
import { saveAs } from 'file-saver';
import { LoadingController } from '@ionic/angular';

import * as lamejs from 'lamejs';

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
        if (this.videoInfo.format === FormatType.MP4) {
            saveAs(blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);
        }
        else {
            this.convertToMP3(blob, checkVideoData);
        }
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

    convertToMP3(blob: Blob, checkVideoData: IVideoCheckResponse) {
        const audioContext = new AudioContext();
        const fileReader = new FileReader();

        // Set up file reader on loaded end event
        fileReader.onloadend = () => {
            const arrayBuffer = fileReader.result as ArrayBuffer;

            // Convert array buffer into audio buffer
            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {

                // Do something with audioBuffer
                console.log(audioBuffer)
                const mp3Blob = this.audioBufferToWav(audioBuffer);
                saveAs(mp3Blob, `${checkVideoData.title}.${this.videoInfo.format.toLocaleLowerCase()}`);

            })
        }

        //Load blob
        fileReader.readAsArrayBuffer(blob)
    }

    /*
    audioBufferToWav(aBuffer) {
        let numOfChan = aBuffer.numberOfChannels,
            btwLength = aBuffer.length * numOfChan * 2 + 44,
            btwArrBuff = new ArrayBuffer(btwLength),
            btwView = new DataView(btwArrBuff),
            btwChnls = [],
            btwIndex,
            btwSample,
            btwOffset = 0,
            btwPos = 0;
        setUint32(0x46464952); // "RIFF"
        setUint32(btwLength - 8); // file length - 8
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt " chunk
        setUint32(16); // length = 16
        setUint16(1); // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(aBuffer.sampleRate);
        setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2); // block-align
        setUint16(16); // 16-bit
        setUint32(0x61746164); // "data" - chunk
        setUint32(btwLength - btwPos - 4); // chunk length

        for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
            btwChnls.push(aBuffer.getChannelData(btwIndex));

        while (btwPos < btwLength) {
            for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
                // interleave btwChnls
                btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
                btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
                btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
                btwPos += 2;
            }
            btwOffset++; // next source sample
        }

        let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
        let wavSamples = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);

        this.wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);

        function setUint16(data) {
            btwView.setUint16(btwPos, data, true);
            btwPos += 2;
        }

        function setUint32(data) {
            btwView.setUint32(btwPos, data, true);
            btwPos += 4;
        }
    }

    wavToMp3(channels, sampleRate, samples) {
        var buffer = [];
        var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        console.log('mp3enc', mp3enc);
        var remaining = samples.length;
        var samplesPerFrame = 1152;
        for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
            var mono = samples.subarray(i, i + samplesPerFrame);
            var mp3buf = mp3enc.encodeBuffer(mono);
            if (mp3buf.length > 0) {
                buffer.push(new Int8Array(mp3buf));
            }
            remaining -= samplesPerFrame;
        }
        var d = mp3enc.flush();
        if(d.length > 0){
            buffer.push(new Int8Array(d));
        }

        var mp3Blob = new Blob(buffer, {type: 'audio/mp3'});
        var bUrl = window.URL.createObjectURL(mp3Blob);

        // send the download link to the console
        console.log('mp3 download:', bUrl);

    }
    */

    audioBufferToWav(aBuffer) {
        let numOfChan = aBuffer.numberOfChannels,
            btwLength = aBuffer.length * numOfChan * 2 + 44,
            btwArrBuff = new ArrayBuffer(btwLength),
            btwView = new DataView(btwArrBuff),
            btwChnls = [],
            btwIndex,
            btwSample,
            btwOffset = 0,
            btwPos = 0;
        setUint32(0x46464952); // "RIFF"
        setUint32(btwLength - 8); // file length - 8
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt " chunk
        setUint32(16); // length = 16
        setUint16(1); // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(aBuffer.sampleRate);
        setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2); // block-align
        setUint16(16); // 16-bit
        setUint32(0x61746164); // "data" - chunk
        setUint32(btwLength - btwPos - 4); // chunk length

        for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
            btwChnls.push(aBuffer.getChannelData(btwIndex));

        while (btwPos < btwLength) {
            for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
                // interleave btwChnls
                btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
                btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
                btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
                btwPos += 2;
            }
            btwOffset++; // next source sample
        }

        let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));

        //Stereo
        let data = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);
        let leftData = [];
        let rightData = [];
        for (let i = 0; i < data.length; i += 2) {
            leftData.push(data[i]);
            rightData.push(data[i + 1]);
        }
        var left = new Int16Array(leftData);
        var right = new Int16Array(rightData);


        if (this.videoInfo.format === 'MP3')
        {
            //STEREO
            if (wavHdr.channels===2)
                return this.wavToMp3(wavHdr.channels, wavHdr.sampleRate,  left,right);
            //MONO
            else if (wavHdr.channels===1)
                return this.wavToMp3(wavHdr.channels, wavHdr.sampleRate,  data);
        }
        else
            return new Blob([btwArrBuff], {type: "audio/wav"});

        function setUint16(data) {
            btwView.setUint16(btwPos, data, true);
            btwPos += 2;
        }

        function setUint32(data) {
            btwView.setUint32(btwPos, data, true);
            btwPos += 4;
        }
    }

    wavToMp3(channels, sampleRate, left, right = null) {
        var buffer = [];
        var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        var remaining = left.length;
        var samplesPerFrame = 1152;

        for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
            if (!right)
            {
                var mono = left.subarray(i, i + samplesPerFrame);
                var mp3buf = mp3enc.encodeBuffer(mono);
            }
            else {
                var leftChunk = left.subarray(i, i + samplesPerFrame);
                var rightChunk = right.subarray(i, i + samplesPerFrame);
                var mp3buf = mp3enc.encodeBuffer(leftChunk,rightChunk);
            }
                if (mp3buf.length > 0) {
                        buffer.push(mp3buf);//new Int8Array(mp3buf));
                }
                remaining -= samplesPerFrame;
        }
        var d = mp3enc.flush();
        if(d.length > 0){
                buffer.push(new Int8Array(d));
        }
        var mp3Blob = new Blob(buffer, {type: 'audio/mp3'});
        //var bUrl = window.URL.createObjectURL(mp3Blob);
        // send the download link to the console
        //console.log('mp3 download:', bUrl);
        return mp3Blob;
    }

}
