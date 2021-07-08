# Nest Ionic Youtube Downloader

**If this project has been useful to you and you want to help me to keep contributing to the open source with projects, examples, plugins,... collaborate and buy me a coffee.**

<a href="https://www.buymeacoffee.com/h6WVj4HcD" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>

Project that allows you to download a youtube video as mp4 or convert the video to mp3.

Technologies

* Client side: Angular, Ionic, Typescript.
* Server side: NestJS, Typescript.

## Conversion to MP3

In order to convert the youtube video to mp3, two strategies have been followed:

### Conversion in client side

On the one hand, I decided to check if it was feasible to perform the conversion on the client side (making use of the lamejs library). The source code for this conversion has been obtained from the following link:

I have encapsulated this code in an angular service to make it easier to call the method to convert the video to mp3.

The truth is that it works quite well. The only drawback is that there is no support for the lamejs library for typescript and it hasn't been updated for 4 years. It would be necessary to add the types.

### Conversion in server side

To convert YouTube video to mp3 on the server side, ffmpeg and fluent-ffmpeg package are used.

This is the most common way to perform the conversion and the one that is explained/developed in most posts or repositories.

## Client side

The Front end is developed in Angular and Ionic.

Some of the dependencies used in the Front project are rjxs, lamejs, trasloco,...

## FRONT Development server

Run `ionic serve` for a dev server. Navigate to `http://localhost:8100/`. The app will automatically reload if you change any of the source files.

## BACK Development server

Run `npm run start:dev` for a dev server. Navigate to `http://localhost:3000/`.

## Hosting

TODO
