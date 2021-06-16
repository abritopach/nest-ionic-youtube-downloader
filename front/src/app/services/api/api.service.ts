import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private readonly API_URL_BASE = environment.API_URL_BASE;

    constructor(private http: HttpClient) { }

    /**
     * Description [This method call convert video api endpoint.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name convertVideo
     * @param
     * @returns {Observable}.
     */

    // TODO: Complete this code.
    convertVideo(payload: any): Observable<any> {
        return this.http
        .post<any>(`${this.API_URL_BASE}`, payload)
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

    // TODO: Complete this code.
    downloadVideo(payload: any): Observable<any> {
        return this.http
        .post<any>(`${this.API_URL_BASE}`, payload)
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
