import { Injectable } from '@angular/core';
import { LoadingController, AlertController, App } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
 Generated class for the ApiProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.

 @todo Adicionar sistema de verificação de ambiente para modificar a URL da api
 */
@Injectable()
export class ApiProvider {
    private url: string;
    private urlBase = 'https://frozensalgados.herokuapp.com/api/v1/';
    private loading;

    constructor(public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected app: App) {
        console.log('ApiProvider running');
    }

    /**
     * Builds the final URL
     *
     * @param controller
     * @param params
     * @returns {ApiProvider}
     */
    builder(controller: string, params: string = null) {
        this.url = this.urlBase + controller + (params ? '?' + params : '');

        return this;
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
    get() {
        return this.http.get(this.url)
            .toPromise()
            .then((api) => {
                this.loading.dismiss();

                return api.json() || {};
            })
            .catch((error) => {
                this.loading.dismiss();

                let alert = this.alertCtrl.create({
                    title: 'Erro inesperado',
                    subTitle: 'Você será redirecionado para a página anterior.',
                    buttons: [
                        {
                            text: 'OK',
                            handler: () => this.app.getRootNav().pop()
                        }
                    ]
                });

                alert.present();
            });
    }
}
