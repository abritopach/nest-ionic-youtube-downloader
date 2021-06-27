import { FormatType } from "./format.model";

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
}