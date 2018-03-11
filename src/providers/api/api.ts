import { Injectable } from '@angular/core';
import { LoadingController, AlertController, App } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';
import { LoginFormPage } from "../../pages/login-form/login-form";
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";

/*
 Generated class for the ApiProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.

 @todo Adicionar sistema de verificação de ambiente para modificar a URL da api
 */
@Injectable()
export class ApiProvider {
    private url: string;
    protected urlBase = 'https://frozensalgados.herokuapp.com/';
    private loading;

    constructor(public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected app: App, private storage: Storage) {
    }

    /**
     * Builds the final URL
     *
     * @param {string} controller
     * @param {boolean} external
     * @returns {ApiProvider}
     */
    builder(controller: string) {
        this.url = this.urlBase + 'api/v1/' + controller;

        return this;
    }

    /**
     * @returns {Observable<Headers>}
     */
    getApiToken(): Observable<Headers> {
        return Observable.fromPromise(this.storage.get('token'));
    }

    /**
     * @returns {Headers}
     */
    getHeaders(): Headers {
        return new Headers({
            'Content-Type': 'application/json'
        });
    }

    /**
     * Shows the loading modal
     *
     * @param message
     * @returns {ApiProvider}
     */
    loader(message: string = 'Carregando') {
        this.loading = this.loadingCtrl.create({
            content: message
        });

        this.loading.present();

        return this;
    }

    /**
     *
     * @param params
     */
    buildUrlParams(params = null) {
        if (params) {
            console.log('params: ', params);

            let urlParams = '';

            for (let key in params) {
                if (urlParams)
                    urlParams += '&';

                urlParams += key + '=' + params[key];
            }

            this.url += urlParams !== '' ? '?' + urlParams : '';
        }
    }

    /**
     * Do the http get request
    **/
    get(params = {}) {
        this.buildUrlParams(params);

        let headers: Headers = this.getHeaders();

        return this.toPromise(this.getApiToken().flatMap(res => {
            headers.append('Authorization', 'Bearer ' + res);

            return this.http.get(this.url, {headers: headers});
        }));
    }

    /**
     * Do the http post request
     *
     * @param params
     * @returns {Promise<T | any[]>}
     */
    post(params) {
        let headers: Headers = this.getHeaders();

        return this.toPromise(this.getApiToken().flatMap(res => {
            headers.append('Authorization', 'Bearer ' + res);

            return this.http.post(this.url, params, {headers: headers});
        }));
    }

    /**
     * Do the http post request
     *
     * @param params
     * @returns {Promise<T | any[]>}
     */
    put(params) {
        let headers: Headers = this.getHeaders();

        return this.toPromise(this.getApiToken().flatMap(res => {
            headers.append('Authorization', 'Bearer ' + res);

            return this.http.put(this.url, params, {headers: headers});
        }));
    }

    /**
     * Do the http delete request
     *
     * @param params
     * @returns {Promise<T | any[]>}
     */
    delete() {
        let headers: Headers = this.getHeaders();

        return this.toPromise(this.getApiToken().flatMap(res => {
            headers.append('Authorization', 'Bearer ' + res);

            return this.http.delete(this.url, {headers: headers});
        }));
    }

    /**
     * @param request
     */
    toPromise(request) {
        return request
            .map((res) => {
                if (this.loading)
                    this.loading.dismiss();

                return res.json() || [];
            })
            .catch((err) => {
                if (this.loading)
                    this.loading.dismiss();

                this.promiseErrorResolver(err).present();

                return [];
            });
    }

    /**
     *
     * @param error
     * @returns {Alert}
     */
    promiseErrorResolver(error) {
        let message = 'Erro no servidor, informe o erro ' + error.status + ' ao administrador';
        let title = 'Erro';

        if (error.status === 401) {
            title = 'Sessão expirada';
            message = 'A sua sessão expirou, logue-se novamente.';
            this.app.getActiveNav().setRoot(LoginFormPage);
        }

        if (error.status === 422) {
            message = 'Falha de validação, verifique os campos';
        }

        if (error.status === 404) {
            message = 'Impossível se conectar ao servidor, verifique sua conexão ou tente novamente em breve';
        }

        return this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
    }
}
