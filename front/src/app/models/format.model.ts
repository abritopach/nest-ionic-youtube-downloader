export enum FormatType {
    mp3 = 'mp3',
    mp4 = 'mp4'
}

export const ACCEPT_MIME_TYPES = new Map([
    [FormatType.mp3, 'audio/mp3'],
    [FormatType.mp4, 'video/mp4']
]);
