import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { NativeStorage } from "@ionic-native/native-storage";
import { ApiProvider } from "../../providers/api/api";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private ApiProvider: ApiProvider, private AuthProvider: AuthProvider, private nativeStorage: NativeStorage) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginFormPage');
    }

    login(e) {
        e.preventDefault();

        if (!this.user.username || !this.user.password) {
            return;
        }

        let data = {
            grant_type: 'password',
            client_id: '7',
            client_secret: 'nfTVOcNidNsnut6Zobd9uz2Teb1Q90fZN8LGyv6z',
            username: this.user.username,
            password: this.user.password,
            scope: ''
        }

        this.AuthProvider.login(data).then((res) => {
            res = res.json();

            this.nativeStorage.setItem('token', {
                'access_token': res.access_token,
                'expires': res.expires_in
            });

            this.ApiProvider.setAccessToken();
            this.navCtrl.push('home');
        });
    }

}
