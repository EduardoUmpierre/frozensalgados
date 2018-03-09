import { Injectable } from '@angular/core';
import { LoadingController, AlertController, App } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';
import { LoginFormPage } from "../../pages/login-form/login-form";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

/*
 Generated class for the ApiProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class CepProvider {
    private loading;

    constructor(public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected app: App) {

    }

    /**
     * Shows the loading modal
     *
     * @param message
     * @returns {ApiProvider}
     */
    loader(message: string = 'Buscando CEP') {
        this.loading = this.loadingCtrl.create({
            content: message
        });

        this.loading.present();

        return this;
    }

    /**
     * Do the http get request
     **/
    get(url: string) {
        return this.toPromise(this.http.get(url));
    }

    private toPromise(request) {
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