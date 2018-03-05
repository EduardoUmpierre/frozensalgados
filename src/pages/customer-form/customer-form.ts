import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";
import { CustomersPage } from "../customers/customers";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
        if (navParams.get('id')) {
            this.pageTitle = 'Editar cliente';
        }
    }

    ionViewDidLoad() {
        if (this.navParams.get('id')) {
            this.apiProvider.builder('customers/' + this.navParams.get('id')).loader().get({'lists': 0}).subscribe((res) => {
                this.customer = res;
                console.log(res);
            });
        }
    }

    submit() {
        if (this.navParams.get('id')) {
            this.apiProvider.builder('customers/' + this.navParams.get('id')).loader().put(this.customer).subscribe((res) => {
                this.navCtrl.push(CustomersPage).then(() => {
                    this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
                });
            });
        }
    }
}
