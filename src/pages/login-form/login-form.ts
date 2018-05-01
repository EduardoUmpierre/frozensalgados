import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { HomePage } from "../home/home";
import { Storage } from '@ionic/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

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
    private form: FormGroup;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, private AuthProvider: AuthProvider, private formBuilder: FormBuilder, private storage: Storage) {
        this.form = this.formBuilder.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    /**
     *
     * @param e
     */
    login(e) {
        e.preventDefault();

        this.AuthProvider.loader('Validando dados')
            .login(this.form.value)
            .then((res) => {
                this.AuthProvider.hideLoader();

                this.storage.set('token', res.access_token).then(() => {
                    this.AuthProvider.getUser().subscribe((user) => {
                        this.storage.set('user', user).then(() => this.navCtrl.setRoot(HomePage))
                    })
                })
            })
            .catch((err) => {
                this.AuthProvider.hideLoader();

                let title = 'Erro';
                let message = 'Erro no servidor, informe o erro ' + err.status + ' ao administrador.';

                if (err.status === 401) {
                    let error = JSON.parse(err._body) || {};

                    if (error.error == 'invalid_credentials') {
                        title = 'Atenção';
                        message = 'Usuário e/ou senha inválidos';
                    }
                }

                if (err.status === 422) {
                    message = 'Falha de validação, verifique os campos';
                }

                if (err.status === 404) {
                    message = 'Não foi possível conectar-se ao servidor. Verifique a sua conexão ou tente novamente em breve.';
                }

                let alert = this.alertCtrl.create({
                    title: title,
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
