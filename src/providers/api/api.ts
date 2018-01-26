import { Injectable } from '@angular/core';
import { LoadingController, AlertController, App } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoginFormPage } from "../../pages/login-form/login-form";
import { Storage } from '@ionic/storage';

/*
 Generated class for the ApiProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.

 @todo Adicionar sistema de verificação de ambiente para modificar a URL da api
 */
@Injectable()
export class ApiProvider {
    private url: string;
    protected urlBase = '//localhost:8000/';
    private loading;
    private header;

    constructor(public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected app: App, private storage: Storage) {
        console.log('Contructor');
        this.setAccessToken();
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
     *
     */
    setAccessToken() {
        this.storage.get('token').then((res) => {
            console.log('api access', res);

            this.header = new Headers({'Authorization': 'Bearer ' + (res ? res.access_token : ''), 'Content-Type': 'application/json'});
        });
    }

    /**
     * Shows the loading modal
     *
     * @param message
     * @returns {ApiProvider}
     */
    loader(message: string = 'Carregando...') {
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
    buildUrlParams(params) {
        if (params) {
            let urlParams = '';

            for (let key in params) {
                if (urlParams)
                    urlParams += '&';

                urlParams += key + '=' + params[key];
            }

            this.url += '?' + urlParams;
        }
    }

    /**
     * Do the http get request
     *
     * @param {{}} params
     * @returns {Promise<T | any[]>}
     */
    get(params = {}) {
        this.buildUrlParams(params);

        let observable = this.http.get(this.url, {headers: this.header});

        return this.toPromise(observable);
    }

    /**
     * Do the http post request
     *
     * @param data
     * @returns {Promise<T | any[]>}
     */
    post(data) {
        let observable = this.http.post(this.url, data, {headers: this.header});

        return this.toPromise(observable);
    }

    /**
     * @param request
     * @returns {Promise<T | any[]>}
     */
    toPromise(request) {
        return request.toPromise()
            .then((res) => {
                if (this.loading)
                    this.loading.dismiss();

                return res.json();
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
