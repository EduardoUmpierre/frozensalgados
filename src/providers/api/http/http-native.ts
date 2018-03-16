import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import { Platform } from "ionic-angular";
import { Pro } from "@ionic/pro";

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
        return Observable.fromPromise(this.platform.ready().then(() => {
            Pro.monitoring.log('API get nativo: ' + url, { level: 'info' });

            return this.http.get(url, {}, options)
                .then(resp => {
                    Pro.monitoring.log('API get nativo response: ' + resp.toLocaleString(), { level: 'info' });

                    return options.responseType == 'text' ? resp.data : JSON.parse(resp.data);
                })
                .catch((err) => Pro.monitoring.log('Erro API get nativo: ' + err.toLocaleString(), { level: 'error' }));
        }));
    }

    /**
     *
     * @param url
     * @param params
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public post(url, params?: any, options: any = {}) {
        return Observable.fromPromise(this.platform.ready().then(() => {
            this.http.setDataSerializer('json');
            return this.http.post(url, params, options)
                .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data))
                .catch((err) => console.log(err));
        }));
    }

    /**
     *
     * @param url
     * @param params
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public put(url, params?: any, options: any = {}) {
        return Observable.fromPromise(this.platform.ready().then(() => {
            this.http.setDataSerializer('json');
            return this.http.put(url, params, options)
                .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data))
                .catch((err) => console.log(err));
        }));
    }

    /**
     *
     * @param url
     * @param options
     * @returns {Observable<HTTPResponse>}
     */
    public delete(url, options: any = {}) {
        return Observable.fromPromise(this.platform.ready().then(() => {
            return this.http.delete(url, {}, options)
                .then(resp => options.responseType == 'text' ? resp.data : JSON.parse(resp.data))
                .catch((err) => console.log(err));
        }));
    }
}