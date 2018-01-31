import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { ApiProvider } from "../../providers/api/api";
import { HomePage } from "../home/home";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login-form',
    templateUrl: 'login-form.html',
})
export class LoginFormPage {
    user: any = {
        username: null,
        password: null
    };

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, private ApiProvider: ApiProvider, private AuthProvider: AuthProvider, private storage: Storage) {

    }

    /**
     *
     * @param e
     */
    login(e) {
        e.preventDefault();

        if (!this.user.username || !this.user.password) {
            return;
        }

        let data = {
            username: this.user.username,
            password: this.user.password
        };

        this.AuthProvider.login(data)
            .then((res) => {
                this.storage.set('token', res.access_token).then(() => {
                    console.log('token criado');

                    this.AuthProvider.getUser().subscribe((user) => {
                        console.log(user);

                        this.storage.set('user', user).then(() => this.navCtrl.setRoot(HomePage))
                    })
                })
            })
            .catch((err) => {
                let message = 'Algo deu errado no servidor, informe o erro ' + err.status + ' ao administrador';

                if (err.status === 401) {
                    message = 'Você não tem permissão para ver isso, informe um usuário e senha válidos';

                    let error = JSON.parse(err._body) || {};

                    if (error.error == 'invalid_credentials') {
                        message = 'Usuário e/ou senha inválidos';
                    }
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

                return err;
            });
    }

}
