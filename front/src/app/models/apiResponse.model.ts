import { IVideoCheckResponse } from "./video.model";

/**
 * Description [Interface to define api response.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */
export interface IAPIResponse {
    success: boolean;
    message: string;
    data: IVideoCheckResponse;
}