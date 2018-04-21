import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";

/**
 * Generated class for the CustomerViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-customer-view',
    templateUrl: 'customer-view.html',
})
export class CustomerViewPage {
    public customer;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
    }

    /**
     * Gets one item by id
     */
    ionViewDidLoad() {
        this.apiProvider.builder('customers/' + this.navParams.get('id')).loader().get().subscribe((res) => this.customer = res);
    }

    /**
     * Push to order form page
     */
    // goToForm() {
    //     this.navCtrl.push(OrderFormPage, {customer: {id: this.customer.id, name: this.customer.name}});
    // }
}
