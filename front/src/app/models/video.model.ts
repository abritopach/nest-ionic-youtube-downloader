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

/**
 * Description [Interfaces to define youtube video playlist response data.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */

export interface YoutubePlaylistResponse {
    playlist: Playlist;
}

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface BestThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface Avatar {
    url: string;
    width: number;
    height: number;
}

export interface BestAvatar {
    url: string;
    width: number;
    height: number;
}

export interface Author {
    name: string;
    url: string;
    avatars: Avatar[];
    bestAvatar: BestAvatar;
    channelID: string;
}

export interface Item {
    title: string;
    index: number;
    id: string;
    shortUrl: string;
    url: string;
    author: Author;
    thumbnails: Thumbnail[];
    bestThumbnail: BestThumbnail;
    isLive: boolean;
    duration: string;
    durationSec?: number;
    isPlayable: boolean;
}
export interface Playlist {
    id: string;
    url: string;
    title: string;
    estimatedItemCount: number;
    views: number;
    thumbnails: Thumbnail[];
    bestThumbnail: BestThumbnail;
    lastUpdated: string;
    description?: any;
    visibility: string;
    author: Author;
    items: Item[];
    continuation?: any;
}
