import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OrderFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-order-form',
    templateUrl: 'order-form.html',
})
export class OrderFormPage {

    constructor(public navCtrl:NavController, public navParams:NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderFormPage');
    }

}
