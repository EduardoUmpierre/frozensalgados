import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpNativeProvider {
    constructor(public http: HTTP) {
    }

    /**
     *
     * @param url
     * @param params
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public get(url, params?: any, options: any = {}) {
        let responseData = this.http.get(url, params, {})
            .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data));

        return Observable.fromPromise(responseData);
    }

    /**
     *
     * @param url
     * @param params
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public post(url, params?: any, options: any = {}) {
        let responseData = this.http.post(url, params, {})
            .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data));

        return Observable.fromPromise(responseData);
    }

    /**
     *
     * @param url
     * @param params
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public put(url, params?: any, options: any = {}) {
        let responseData = this.http.put(url, params, {})
            .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data));

        return Observable.fromPromise(responseData);
    }

    /**
     *
     * @param url
     * @param params
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public delete(url, params?: any, options: any = {}) {
        let responseData = this.http.delete(url, params, {})
            .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data));

        return Observable.fromPromise(responseData);
    }
}