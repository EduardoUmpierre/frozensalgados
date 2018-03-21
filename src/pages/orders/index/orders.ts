import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { OrderViewPage } from '../view/order-view';
import { OrderFormPage } from '../form/order-form';
import { Storage } from "@ionic/storage";
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
    loaded: boolean = false;

    constructor(public navCtrl: NavController, public storage: Storage, private syncProvider: SyncProvider) {
    }

    /**
     * Gets the order list
     */
    ionViewDidLoad() {
        this.storage.get('sync').then(sync => {
            sync = sync || [];

            if (sync['orders']) {
                this.orders = sync['orders']['items'];
            } else {
                // this.syncProvider.sync(['orders'], 'orders').then(res => this.orders = res['items']);
            }

            this.loaded = true;
        });
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
}
