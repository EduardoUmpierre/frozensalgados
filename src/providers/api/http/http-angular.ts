import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
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
        let requestOptions = new RequestOptions();
        requestOptions.withCredentials = true;
        requestOptions.headers = options;

        return this.http.get(url, requestOptions).map(resp => options.responseType == 'text' ? resp.text() : resp.json());
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
     * @param options
     * @returns {Observable<any>}
     */
    public put(url, options: any = {}) {
        let requestOptions = new RequestOptions();
        requestOptions.withCredentials = true;
        requestOptions.headers = options;

        return this.http.put(url, requestOptions).map(resp => options.responseType == 'text' ? resp.text() : resp.json());
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