import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ListFormPage } from "../list-form/list-form";

/**
 * Generated class for the OrderViewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-order-view',
    templateUrl: 'order-view.html',
})
export class OrderViewPage {
    public order;
    private id;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
    }

    /**
     * Gets one item by id
     */
    ionViewDidLoad() {
        this.id = this.navParams.get('id');

        this.apiProvider.builder('orders/' + this.id).loader().get().subscribe((res) => this.order = res);
    }

    /**
     * Push to list form page
     */
    goToForm() {
        this.navCtrl.push(ListFormPage, {
            customer: this.order.customer.id,
            orderId: this.id,
            order: this.order.order_product
        });
    }
}
