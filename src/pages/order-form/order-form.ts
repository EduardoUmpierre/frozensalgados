import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SelectSearchable } from '../../components/select/select';
import { ApiProvider } from "../../providers/api/api";
import { OrderProductModalPage } from '../order-product-modal/order-product-modal';
import { Product } from "../../models/Product";

/**
 * Generated class for the OrderFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-order-form',
    templateUrl: 'order-form.html',
})
export class OrderFormPage {
    pageTitle = 'Criar pedido';
    customer;
    order: Product[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider, public modalCtrl: ModalController) {
        if (navParams.get('product')) {
            this.pageTitle = 'Editar pedido';
        } else {

        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderFormPage');

        console.log(this.order);
    }

    /**
     *
     * @param event
     */
    searchCustomers(event: { component: SelectSearchable, text: string }) {
        let name = event.text || '';

        event.component.isSearching = true;

        this.apiProvider.builder('customers', 'name=' + name).get().then((customers) => {
            event.component.items = customers;
            event.component.isSearching = false;
        });
    }

    /**
     *
     * @param event
     */
    searchCustomerLists(event: { component: SelectSearchable, value: any }) {
        console.log(this.customer);
        console.log('value:', event.value);
    }

    /**
     *
     */
    loadProductModal() {
        let productModal = this.modalCtrl.create(OrderProductModalPage);

        productModal.onDidDismiss(data => {
            console.log(data);
            this.order.push(data);
        });

        productModal.present();
    }

    create() {
        let data = {customer: this.customer.id, order: this.normalizeOrderData(this.order)};

        this.apiProvider.builder('orders').loader().post(data).then((res) => {
            this.navCtrl.pop();
        });
    }

    normalizeOrderData(order) {
        let data = [];

        order.forEach(function(e, i) {
            data.push({id: e.id, qnt: e.quantity});
        });

        return data;
    }
}
