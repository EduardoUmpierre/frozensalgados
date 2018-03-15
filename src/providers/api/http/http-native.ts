import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import { Platform } from "ionic-angular";

@Injectable()
export class HttpNativeProvider {
    constructor(public http: HTTP, public platform: Platform) {
    }

    /**
     * @param url
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public get(url, options: any = {}) {
        this.platform.ready().then(() => {
            let responseData = this.http.get(url, {}, options)
                .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data));

            return Observable.fromPromise(responseData);
        });
    }

    /**
     *
     * @param url
     * @param params
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public post(url, params?: any, options: any = {}) {
        this.platform.ready().then(() => {
            this.http.setDataSerializer('json');
            let responseData = this.http.post(url, params, options)
                .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data));

            return Observable.fromPromise(responseData);
        });
    }

    /**
     *
     * @param url
     * @param params
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public put(url, params?: any, options: any = {}) {
        this.platform.ready().then(() => {
            this.http.setDataSerializer('json');
            let responseData = this.http.put(url, params, options)
                .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data));

            return Observable.fromPromise(responseData);
        });
    }

    /**
     *
     * @param url
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public delete(url, options: any = {}) {
        this.platform.ready().then(() => {
            let responseData = this.http.delete(url, {}, options)
                .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data));

            return Observable.fromPromise(responseData);
        });
    }
}