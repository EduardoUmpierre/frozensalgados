import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import { CustomerFormPage } from "../form/customer-form";

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
    goToForm() {
        this.navCtrl.push(CustomerFormPage, {id: this.customer.id});
    }
}
