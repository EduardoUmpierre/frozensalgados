import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { CustomerViewPage } from "../customer-view/customer-view";

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

    public customers;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
    }

    /**
     * Called when the view is loaded
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad CustomersPage');

        this.initializeItems();
    }

    /**
     * Toggle card summary status
     *
     * @param  {number} index customer index
     */
    toggleCard(index: number) {
        this.customers[index]["toggle"] = !this.customers[index]["toggle"];
    }

    /**
     * Reset items back to all of the items
     */
    initializeItems() {
        this.apiProvider.builder('customers').loader().get().then((res) => this.customers = res);
    }

    /**
     * Performs the filter in customers
     * @param  {any}    ev searchbar
     */
    getItems(ev: any) {
        this.initializeItems();

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.customers = this.customers.filter((item) => {
                return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
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
