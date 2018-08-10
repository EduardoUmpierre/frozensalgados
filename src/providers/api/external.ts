import { Injectable } from '@angular/core';
import { ApiProvider } from "./api";
import { ResponseContentType } from "@angular/http";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ExternalProvider extends ApiProvider {
    externalApi = {
        'receita': {
            'angular': '/receita',
            'native': 'https://www.receitaws.com.br'
        },
        'cep': {
            'angular': '/cep',
            'native': 'https://viacep.com.br'
        }
    };

    /**
     * HTTP GET request
     *
     * @param {{}} item
     * @param {string} url
     * @returns {any}
     */
    getExternal(item, url: string) {
        let env = 'angular';

        if (this.isApp() || this.isWebApp()) {
            env = 'native';
        }

        url = this.externalApi[item][env] + url;

        if (this.isWebApp()) {
            url = 'https://cors-anywhere.herokuapp.com/' + url;

            if (item == 'receita') {
                url += '?callback=';
            }

            return Observable.fromPromise(new Promise((resolve, reject) => {
                let xhr = this.createCORSRequest('GET', url);

                if (!xhr) {
                    reject(new Error('CORS not supported'));
                }

                // Response handlers.
                xhr.onload = function() {
                    resolve(xhr);
                };

                xhr.onerror = function() {
                    reject(xhr)
                };

                xhr.send();
            })).map((res: XMLHttpRequest) => {
                this.hideLoader();

                return JSON.parse(res.response);
            }).catch(err => {
                this.hideLoader();

                return [];
            });
        } else {
            return this.resolve(this.httpProvider.http.get(url, {}));
        }
    }

    /**
     * Shows a custom alert
     *
     * @param {string} message
     */
    showAlert(message: string) {
        let alert = this.alertCtrl.create({
            title: 'Aviso',
            message: message,
            buttons: [
                {text: 'OK'}
            ]
        });

        alert.present();
    }

    /**
     * Creates the request
     *
     * @param method
     * @param url
     * @returns {XMLHttpRequest}
     */
    createCORSRequest(method, url) {
        let xhr = new XMLHttpRequest();

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else {
            // Otherwise, CORS is not supported by the browser.
            xhr = null;
        }

        return xhr;
    }
}
