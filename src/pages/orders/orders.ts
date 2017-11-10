import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { OrderViewPage } from '../order-view/order-view';

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
    public orders;

    constructor(public navCtrl:NavController, public navParams:NavParams, private apiProvider:ApiProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrdersPage');

        this.initializeItems();
    }

    /**
     * Reset items back to all of the items
     */
    initializeItems() {
        this.apiProvider
            .builder('orders')
            .loader('Carregando pedidos...')
            .get()
            .then((res) => {
                console.log(res);
                this.orders = res;
            });
    }

    showDetails(id) {
        this.navCtrl.push(OrderViewPage, {
            id: id
        });
    }
}