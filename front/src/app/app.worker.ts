/// <reference lib="webworker" />

import * as lamejs from 'lamejs';

addEventListener('message', async ({ data }) => {
  console.log('worker got blob:', data.blob);
  console.log('worker got fileName:', data.fileName);
  // const mp3Blob = await convertToMP3( data.blob);
  postMessage(/*mp3Blob*/data.blob);
});

/*
function convertToMP3(blob: Blob): Promise<Blob> {

  return new Promise((resolve, reject) => {

  const audioContext = new AudioContext();
  const fileReader = new FileReader();
  // Set up file reader on loaded end event.
  fileReader.onloadend = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;

      // Convert array buffer into audio buffer.
      audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          const mp3Blob = this.audioBufferToWav(audioBuffer);
          resolve(mp3Blob);
      });
  };
  fileReader.onerror = reject;
  //Load blob
  fileReader.readAsArrayBuffer(blob);
  });
}

function audioBufferToWav(aBuffer: AudioBuffer) {
  const numOfChan = aBuffer.numberOfChannels;
  const btwLength = aBuffer.length * numOfChan * 2 + 44;
  const btwArrBuff = new ArrayBuffer(btwLength);
  const btwView = new DataView(btwArrBuff);
  const btwChnls = [];
  let btwSample: number; let btwPos = 0; let btwOffset = 0;

  const setUint16 = (value) => {
      btwView.setUint16(btwPos, value, true);
      btwPos += 2;
  };

  const setUint32 = (value) => {
      btwView.setUint32(btwPos, value, true);
      btwPos += 4;
  };

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
      {btwChnls.push(aBuffer.getChannelData(btwIndex));}

  while (btwPos < btwLength) {
      for (let btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
          // interleave btwChnls
          btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
          btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) || 0; // scale to 16-bit signed int
          btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
          btwPos += 2;
      }
      btwOffset++; // next source sample
  }

  const wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));

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


      if (wavHdr.channels===2)
          {return this.wavToMp3(wavHdr.channels, wavHdr.sampleRate, left, right);}
      //MONO
      else if (wavHdr.channels===1)
          {return this.wavToMp3(wavHdr.channels, wavHdr.sampleRate, data);}
}
*/
