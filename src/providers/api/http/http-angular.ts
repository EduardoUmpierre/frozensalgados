import { Injectable } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpAngularProvider {
    constructor(public http: Http) {
    }

    /**
     * @param url
     * @param options
     * @returns {Observable<any>}
     */
    public get(url, options: any = {}) {
        let requestOptions = new RequestOptions({
            headers: options,
            responseType: options.responseType == 'json' ? ResponseContentType.Json : options.responseType
        });
        requestOptions.withCredentials = true;

        return this.http.get(url, requestOptions).map(resp => {
            let response;

            switch (options.responseType) {
                case 'text':
                    response = resp.text();
                    break;
                case 'blob':
                    response = resp;
                    break;
                case ResponseContentType.Blob:
                    response = resp;
                    break;
                default:
                    response = resp.json();
                    break;
            }

            return response;
        });
    }

    /**
     * @param url
     * @param params
     * @param options
     * @returns {Observable<any>}
     */
    public post(url, params: any, options: any = {}) {
        let requestOptions = new RequestOptions();
        requestOptions.withCredentials = true;
        requestOptions.headers = options;

        return this.http.post(url, params, requestOptions).map(resp => options.responseType == 'text' ? resp.text() : resp.json());
    }

    /**
     * @param url
     * @param params
     * @param options
     * @returns {Observable<any>}
     */
    public put(url, params: any, options: any = {}) {
        let requestOptions = new RequestOptions();
        requestOptions.withCredentials = true;
        requestOptions.headers = options;

        return this.http.put(url, params, requestOptions).map(resp => options.responseType == 'text' ? resp.text() : resp.json());
    }

    /**
     * @param url
     * @param options
     * @returns {Observable<any>}
     */
    public delete(url, options: any = {}) {
        let requestOptions = new RequestOptions();
        requestOptions.withCredentials = true;
        requestOptions.headers = options;

        return this.http.delete(url, requestOptions).map(resp => options.responseType == 'text' ? resp.text() : resp.json());
    }
}