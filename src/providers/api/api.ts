import { Injectable } from '@angular/core';
import { LoadingController, AlertController, App, Platform } from 'ionic-angular';
import { HttpProvider } from './http/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';
import { LoginFormPage } from "../../pages/login-form/login-form";
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ApiProvider {
    private url: string;
    protected urlBase = this.isApp() ? 'https://frozensalgados.herokuapp.com/' : 'http://localhost:8000/';
    protected loading;

    constructor(public httpProvider: HttpProvider, private platform: Platform, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public app: App, private storage: Storage) {
    }

    /**
     * Builds the final URL
     *
     * @param {string} controller
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
     * Builds the URL parameters
     *
     * @param params
     */
    private buildUrlParams(params = null) {
        if (params) {
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
     * HTTP GET request
     *
     * @param {{}} params
     * @returns {any}
     */
    get(params = {}) {
        this.buildUrlParams(params);

        return this.toPromise(this.getApiToken().flatMap((res) => this.httpProvider.http.get(this.url, {
            'Authorization': 'Bearer ' + res
        })));
    }

    /**
     * HTTP POST request
     *
     * @param params
     * @returns {any}
     */
    post(params) {
        return this.toPromise(this.getApiToken().flatMap(res => this.httpProvider.http.post(this.url, params, {
            'Authorization': 'Bearer ' + res,
            'Content-Type': 'application/json'
        })));
    }

    /**
     * HTTP PUT request
     *
     * @param params
     * @returns {any}
     */
    put(params) {
        return this.toPromise(this.getApiToken().flatMap(res => this.httpProvider.http.put(this.url, params, {
            'Authorization': 'Bearer ' + res,
            'Content-Type': 'application/json'
        })));
    }

    /**
     * HTTP DELETE request
     *
     * @returns {any}
     */
    delete() {
        return this.toPromise(this.getApiToken().flatMap(res => this.httpProvider.http.delete(this.url, {
            'Authorization': 'Bearer ' + res
        })));
    }

    /**
     * @param request
     */
    public toPromise(request) {
        return request
            .map((res) => {
                this.hideLoader();

                return res || [];
            })
            .catch((err) => {
                this.hideLoader();

                this.promiseErrorResolver(err).present();

                return [];
            });
    }

    /**
     *
     * @param error
     * @returns {Alert}
     */
    public promiseErrorResolver(error) {
        let title = 'Erro';
        let message = 'Erro no servidor, informe o erro ' + error.status + ' ao administrador.';

        console.log(error);

        if (error.status === 401) {
            title = 'Sessão expirada';
            message = 'A sua sessão expirou, logue-se novamente.';

            this.app.getActiveNav().setRoot(LoginFormPage);
        }

        if (error.status === 422) {
            message = 'Falha de validação, verifique os campos.';
        }

        if (error.status === 404) {
            message = 'Impossível se conectar ao servidor, verifique sua conexão ou tente novamente em breve.';
        }

        return this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [{text: 'OK'}]
        });
    }

    /**
     * Hides the loader if it's visible
     */
    public hideLoader() {
        if (this.loading) {
            this.loading.dismiss();
        }
    }

    /**
     * @returns {boolean}
     */
    public isApp() {
        return this.platform.is('core') || this.platform.is('cordova');
    }
}
