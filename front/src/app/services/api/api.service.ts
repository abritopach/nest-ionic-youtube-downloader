import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ApiResponse } from '@models/apiResponse.model';
import { VideoInfo } from '@models/video.model';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private readonly apiUrlBase = environment.apiUrlBase;

    constructor(private http: HttpClient) { }

    /**
     * Description [This method call check youtube video api endpoint.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name checkVideo
     * @param
     * @returns {Observable}.
     */

    checkVideo(payload: {url: string}): Observable<ApiResponse> {
        return this.http
        .post<ApiResponse>(`${this.apiUrlBase}/youtube-video-downloader/check-video`, payload)
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    /**
     * Description [This method call download video api endpoint.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name downloadVideo
     * @param
     * @returns {Observable}.
     */

    downloadVideo(payload: VideoInfo): Observable<ApiResponse> {
        return this.http
        .post<ApiResponse>(`${this.apiUrlBase}/youtube-video-downloader/download`, payload)
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    /**
     * Description [This method call download playlist api endpoint.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name downloadVideo
     * @param
     * @returns {Observable}.
     */

    downloadPlaylist(payload: VideoInfo): Observable<ApiResponse> {
        return this.http
        .post<ApiResponse>(`${this.apiUrlBase}/youtube-video-downloader/download-playlist`, payload)
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    /**
     * Description [This method call download and convert video api endpoint.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name downloadVideo
     * @param
     * @returns {Observable}.
     */

    downloadAndConvertVideo(payload: VideoInfo): Observable<ApiResponse> {
        return this.http
        .post<ApiResponse>(`${this.apiUrlBase}/youtube-video-downloader/downloadAndConvert`, payload)
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    /**
     * Description [This method handles api endpoints errors.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name handleError
     * @param error - Api endpoint response error.
     * @returns {Observable}.
     */

    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors.
            errorMessage = `Error: ${error.error.message}`;
            console.log(`Error: ${error.error.message}`);
        } else {
            // Server-side errors.
            if (error) {
                console.error(`Error Code: ${error?.status}\nMessage: ${error?.message}`);
                errorMessage = `Error: ${error.error?.message}`;
            }
        }
        return throwError(errorMessage);
    }


}
