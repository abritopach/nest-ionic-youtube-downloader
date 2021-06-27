export enum FormatType {
    MP3 = 'MP3',
    MP4 = 'MP4'
}

export const ACCEPT_MIME_TYPES = new Map([
    [FormatType.MP3, 'audio/mp3'],
    [FormatType.MP4, 'video/mp4']
]);