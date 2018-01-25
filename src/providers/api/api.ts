import { Injectable } from '@angular/core';
import { LoadingController, AlertController, App } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
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
        console.log('ApiProvider running');
    }

    /**
     * Builds the final URL
     *
     * @param {string} controller
     * @param {string} token
     * @returns {ApiProvider}
     */
    builder(controller: string, token: string = null) {
        this.url = this.urlBase + 'api/v1/' + controller;

        this.setAccessToken(token);

        return this;
    }

    buildUrlParams(params) {
        let urlParams = '';

        for (let key in params) {
            if (urlParams) {
                urlParams += '&';
            }

            urlParams += key + '=' + params[key];
        }

        if (urlParams) {
            this.url += '?' + urlParams;
        }
    }

    setAccessToken(token: string = null) {
        if (!token) {
            this.storage.get('token').then((res) => {
                this.setHeaders(res);
            });
        } else {
            this.setHeaders(token);
        }
    }

    setHeaders(token) {
        let headers = new Headers({'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'});
        this.header = new RequestOptions({ headers: headers });
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
     * Do the http get request
     *
     * @returns {any|Thenable<any|Promise<any>|JSON|{}>|Function|Promise<R>}
     */
    get(params = {}) {
        this.buildUrlParams(params);

        let observable = this.http.get(this.url, this.header);

        return this.toPromise(observable);

        // .catch((error) => {
        //     this.loading.dismiss();
        //
        //     let alert = this.alertCtrl.create({
        //         title: 'Erro inesperado',
        //         subTitle: 'Você será redirecionado para a página anterior.',
        //         buttons: [
        //             {
        //                 text: 'OK',
        //                 handler: () => this.app.getRootNav().pop()
        //             }
        //         ]
        //     });
        //
        //     alert.present();
        // });
    }

    /**
     * Do the http post request
     *
     * @param data
     * @returns {any}
     */
    post(data) {
        let observable = this.http.post(this.url, data, this.header);

        return this.toPromise(observable);
    }

    /**
     * @param request
     * @returns {Promise<T>}
     */
    toPromise(request) {
        console.log(request);

        return request.toPromise()
            .then((res) => {
                if (this.loading)
                    this.loading.dismiss();

                console.log(res);

                return res.json() || {};
            })
            .catch((err) => {
                if (this.loading)
                    this.loading.dismiss();

                let message = 'Algo deu errado no servidor, informe o erro ' + err.status + ' ao administrador';

                if (err.status === 401) {
                    message = 'Você não tem permissão para ver isso, informe um usuário e senha válidos';
                    this.app.getActiveNav().setRoot(LoginFormPage);
                }

                if (err.status === 422) {
                    message = 'Falha de validação, verifique os campos';
                }

                if (err.status === 404) {
                    message = 'Impossível se conectar ao servidor, verifique sua conexão ou tente novamente em alguns minutos';
                }

                let alert = this.alertCtrl.create({
                    title: 'Erro',
                    subTitle: message,
                    buttons: [
                        {text: 'OK'}
                    ]
                });

                alert.present();

                return [];
            });
    }
}
