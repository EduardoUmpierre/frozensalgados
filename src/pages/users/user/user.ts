import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LoginFormPage } from "../../login-form/login-form";
import { UserFormPage } from "../form/user-form";

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

    /**
     * Push to user form page
     *
     * @param {number} id
     */
    goToForm(id: number = null) {
        this.navCtrl.push(UserFormPage, {id: this.user.id});
    }

    /**
     * Do the logout function
     */
    logout() {
        this.storage.clear()
            .then(() => this.navCtrl.push(LoginFormPage)
                .then(() => this.navCtrl.setRoot(LoginFormPage)));
    }
}
