import { Injectable } from '@angular/core';
import { ApiProvider } from "./api";
import { AlertController } from "ionic-angular";

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

        if (this.isApp()) {
            env = 'native';
        }

        url = this.externalApi[item][env] + url;

        return this.resolve(this.httpProvider.http.get(url, {}));
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
}