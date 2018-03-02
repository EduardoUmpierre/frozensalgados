import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { CustomerViewPage } from "../customer-view/customer-view";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the CustomersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-customers',
    templateUrl: 'customers.html',
})
export class CustomersPage {
    user: any = {};
    public customers;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, public storage: Storage) {
    }

    /**
     * Called when the view is loaded
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad CustomersPage');

        this.apiProvider.builder('customers').loader().get().subscribe((res) => this.customers = res);
        this.storage.get('user').then((user) => this.user = user);
    }

    /**
     * Push to customer details page
     *
     * @param id
     */
    goToDetails(id) {
        this.navCtrl.push(CustomerViewPage, {id: id});
    }
}
