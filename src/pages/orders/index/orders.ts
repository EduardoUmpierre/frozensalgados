import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { OrderViewPage } from '../view/order-view';
import { OrderFormPage } from '../form/order-form';

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

    constructor(public navCtrl: NavController, private apiProvider: ApiProvider) {
    }

    /**
     * Gets the order list
     */
    ionViewDidLoad() {
        this.apiProvider.builder('orders').loader().get({order: 'desc'}).subscribe((res) => {
            this.orders = res;
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
