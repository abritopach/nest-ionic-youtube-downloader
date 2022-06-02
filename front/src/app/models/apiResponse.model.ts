import { VideoCheckResponse, VideoDownloadedData, YoutubePlaylistResponse } from './video.model';

/**
 * Description [Interface to define api response.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */
export interface ApiResponse {
    success: boolean;
    message: string;
    data: VideoCheckResponse | VideoDownloadedData | YoutubePlaylistResponse;
}
