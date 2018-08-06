import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderViewPage } from '../view/order-view';
import { OrderFormPage } from '../form/order-form';
import { SyncProvider } from "../../../providers/sync/sync";

/**
 * Generated class for the OrdersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {
    orders = [];
    filteredItems = [];
    loaded: boolean = false;

    constructor(public navCtrl: NavController, private navParams: NavParams, private syncProvider: SyncProvider) {
    }

    /**
     * Gets the order list
     */
    ionViewWillEnter() {
        this.syncProvider
            .verifySync('orders', this.navParams.get('force'))
            .then(orders => {
                this.orders = orders;
                this.filteredItems = orders;
            })
            .then(() => this.loaded = true)
            .catch((error) => console.log(error));
    }

    /**
     * Push to order details page
     *
     * @param id
     */
    goToDetails(id) {
        this.navCtrl.push(OrderViewPage, {id: id});
    }

    /**
     * Push to order form page
     */
    goToForm() {
        this.navCtrl.push(OrderFormPage);
    }

    /**
     * Updates the orders with the refresher
     *
     * @param refresher
     */
    doRefresh(refresher) {
        this.syncProvider
            .verifySync('orders', true, false)
            .then(orders => {
                this.orders = orders;
                this.filteredItems = orders;
            })
            .then(() => refresher.complete())
            .catch((error) => console.log(error));
    }

    /**
     * @param ev
     * @returns {any[]}
     */
    filterItems(ev: any) {
        let val = ev.target.value;

        this.filteredItems = this.orders.filter((item) => item.customer.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
    }
}
