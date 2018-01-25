import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LoginFormPage } from "../login-form/login-form";

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {
    user: any = {};

    constructor(public navCtrl: NavController, public storage: Storage) {
        this.storage.get('user').then((user) => this.user = user);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UserPage');
    }

    logout() {
        this.storage.remove('token')
            .then(() => this.storage.remove('user')
                .then(() => {
                    this.navCtrl.push(LoginFormPage).then(() => this.navCtrl.setRoot(LoginFormPage));
                }));
    }
}
