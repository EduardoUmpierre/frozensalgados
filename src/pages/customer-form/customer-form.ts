import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CustomerFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-customer-form',
    templateUrl: 'customer-form.html',
})
export class CustomerFormPage {
    pageTitle = 'Novo cliente';
    customer = {};

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        if (navParams.get('id')) {
            this.pageTitle = 'Editar cliente';
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CustomerFormPage');
    }

}
