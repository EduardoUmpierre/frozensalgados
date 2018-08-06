import { Injectable } from '@angular/core';
import { LoadingController, AlertController, App, Platform, ToastController } from 'ionic-angular';
import { HttpProvider } from './http/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { LoginFormPage } from "../../pages/login-form/login-form";
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ApiProvider {
    private url: string;
    public urlBase = this.isApp() ? 'https://frozensalgados.herokuapp.com/' : 'http://localhost:8000/';
    protected loading;

    constructor(public httpProvider: HttpProvider, private platform: Platform, public loadingCtrl: LoadingController,
                public alertCtrl: AlertController, public app: App, private storage: Storage,
                protected toastCtrl: ToastController) {
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
     * Shows the toast
     *
     * @param {string} message
     * @param {number} duration
     */
    toast(message: string, duration: number = 3000) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });

        toast.present();

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
     * @param {string} type
     * @returns {any}
     */
    get(params = {}, type: any = 'json') {
        this.buildUrlParams(params);

        return this.resolve(this.getApiToken().flatMap((res) => this.httpProvider.http.get(this.url, {
            'Authorization': 'Bearer ' + res,
            'responseType': type,
            'Accept': 'application/pdf'
        })));
    }

    /**
     * HTTP POST request
     *
     * @param params
     * @returns {any}
     */
    post(params) {
        return this.resolve(this.getApiToken().flatMap(res => this.httpProvider.http.post(this.url, params, {
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
        return this.resolve(this.getApiToken().flatMap(res => this.httpProvider.http.put(this.url, params, {
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
        return this.resolve(this.getApiToken().flatMap(res => this.httpProvider.http.delete(this.url, {
            'Authorization': 'Bearer ' + res
        })));
    }

    /**
     * @param request
     */
    public resolve(request) {
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

        if (error.status == 401) {
            title = 'Sessão expirada';
            message = 'A sua sessão expirou, logue-se novamente.';

            if (error.error == 'invalid_credentials') {
                title = 'Atenção';
                message = 'Usuário e/ou senha inválidos';
            } else {
                this.app.getActiveNav().setRoot(LoginFormPage);
            }
        }

        if (error.status === 422) {
            title = 'Atenção';
            message = '<p>Falha de validação, verifique os campos.</p>';

            let body = JSON.parse(error._body) || {};

            if (body) {
                message += '<ul>';
                for (let item in body) {
                    if (body[item].indexOf('validation.unique') !== -1) {
                        message += '<li>O ' + item + ' já está cadastrado.</li>';
                    }
                }
                message += '</ul>';
            }
        }

        if (error.status === 404) {
            message = 'Não foi possível conectar-se ao servidor. Verifique a sua conexão ou tente novamente em breve.';
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
            this.loading.dismiss().catch(() => {
            });
        }
    }

    /**
     * @returns {boolean}
     */
    public isApp() {
        return this.httpProvider.isApp();
    }
}
