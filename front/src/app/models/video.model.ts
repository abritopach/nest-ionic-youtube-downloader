import { FormatType } from './format.model';

/**
 * Description [Interface to define video info data.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */

export interface IVideoInfo {
    url: string;
    format: FormatType;
    quality?: string;
}

/**
 * Description [Interface to define video thumbnail.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */

interface IThumbnail {
    width: number;
    height: number;
    url: string;
}

/**
 * Description [Interface to define video check response data.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */

export interface IVideoCheckResponse {
    author: string;
    title: string;
    thumbnails: IThumbnail[];
}

/**
 * Description [Interface to define video downloaded data.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */

export interface IVideoDownloadedData {
    type: 'Buffer';
    data: number[];
}
