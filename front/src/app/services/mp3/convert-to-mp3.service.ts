import { Injectable } from '@angular/core';

import * as lamejs from 'lamejs';

@Injectable({
    providedIn: 'root'
})
export class ConvertToMp3Service {

    constructor() { }

    convertToMP3(blob: Blob): Promise<Blob> {

        return new Promise((resolve, reject) => {

        const audioContext = new AudioContext();
        const fileReader = new FileReader();
        // Set up file reader on loaded end event.
        fileReader.onloadend = () => {
            const arrayBuffer = fileReader.result as ArrayBuffer;

            // Convert array buffer into audio buffer.
            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                console.log(audioBuffer)
                const mp3Blob = this.audioBufferToWav(audioBuffer);
                resolve(mp3Blob)
            })
        }
        fileReader.onerror = reject;
        //Load blob
        fileReader.readAsArrayBuffer(blob)
        });
    }

    private audioBufferToWav(aBuffer: AudioBuffer) {
        const numOfChan = aBuffer.numberOfChannels,
            btwLength = aBuffer.length * numOfChan * 2 + 44,
            btwArrBuff = new ArrayBuffer(btwLength),
            btwView = new DataView(btwArrBuff),
            btwChnls = [];
        let btwSample: number, btwPos = 0, btwOffset = 0;
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

        for (let btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
            btwChnls.push(aBuffer.getChannelData(btwIndex));

        while (btwPos < btwLength) {
            for (let btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
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
        const data = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);
        const leftData = [];
        const rightData = [];
        for (let i = 0; i < data.length; i += 2) {
            leftData.push(data[i]);
            rightData.push(data[i + 1]);
        }
        const left = new Int16Array(leftData);
        const right = new Int16Array(rightData);


        // if (format === 'MP3') {
            //STEREO
            if (wavHdr.channels===2)
                return this.wavToMp3(wavHdr.channels, wavHdr.sampleRate, left, right);
            //MONO
            else if (wavHdr.channels===1)
                return this.wavToMp3(wavHdr.channels, wavHdr.sampleRate, data);
        // }
        // else
        //    return new Blob([btwArrBuff], {type: "audio/wav"});

        function setUint16(data) {
            btwView.setUint16(btwPos, data, true);
            btwPos += 2;
        }

        function setUint32(data) {
            btwView.setUint32(btwPos, data, true);
            btwPos += 4;
        }
    }

    private wavToMp3(channels: number, sampleRate: number, left: Int16Array, right: Int16Array = null) {
        const buffer = [];
        const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        let remaining = left.length;
        const samplesPerFrame = 1152;
        let mp3buf;

        for (let i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
            if (!right)
            {
                const mono = left.subarray(i, i + samplesPerFrame);
                mp3buf = mp3enc.encodeBuffer(mono);
            }
            else {
                const leftChunk = left.subarray(i, i + samplesPerFrame);
                const rightChunk = right.subarray(i, i + samplesPerFrame);
                mp3buf = mp3enc.encodeBuffer(leftChunk,rightChunk);
            }
                if (mp3buf.length > 0) {
                        buffer.push(mp3buf);//new Int8Array(mp3buf));
                }
                remaining -= samplesPerFrame;
        }
        const d = mp3enc.flush();
        if(d.length > 0){
                buffer.push(new Int8Array(d));
        }
        const mp3Blob = new Blob(buffer, {type: 'audio/mp3'});
        //var bUrl = window.URL.createObjectURL(mp3Blob);
        // send the download link to the console
        //console.log('mp3 download:', bUrl);
        return mp3Blob;
    }
}
