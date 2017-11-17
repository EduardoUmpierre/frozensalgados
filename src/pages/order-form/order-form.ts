import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SelectSearchable } from '../../components/select/select';
import { ApiProvider } from "../../providers/api/api";
import { OrderProductModalPage } from '../order-product-modal/order-product-modal';
import { OrdersPage } from "../orders/orders";
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
     * Loads the customer data
     *
     * @param event
     */
    searchCustomers(event: { component: SelectSearchable, text: string }) {
        let name = event.text || '';

        event.component.isSearching = true;

        this.apiProvider.builder('customers').get({name: name}).then((customers) => {
            event.component.items = customers;
            event.component.isSearching = false;
        });
    }

    /**
     * Lados the customer's order lists
     *
     * @param event
     *
     * @todo Procura as listas do cliente selecionado
     */
    searchCustomerLists(event: { component: SelectSearchable, value: any }) {
        console.log(this.customer);
        console.log('value:', event.value);
    }

    /**
     * Loads the product modal
     */
    loadProductModal() {
        let productModal = this.modalCtrl.create(OrderProductModalPage);

        productModal.onDidDismiss(data => {
            if (data instanceof Product) {
                this.order.push(data);
            }
        });

        productModal.present();
    }

    /**
     * Creates the order and redirects to the orders page
     */
    create() {
        let data = {customer: this.customer.id, order: this.normalizeOrderData(this.order)};

        this.apiProvider.builder('orders').loader().post(data).then((res) => {
            this.navCtrl.push(OrdersPage).then(() => {
                this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
            });
        });
    }

    /**
     * Removes the unnecessary data from the array
     *
     * @param order
     * @returns {Array}
     */
    normalizeOrderData(order) {
        let data = [];

        order.forEach(function (e, i) {
            data.push({id: e.id, qnt: e.quantity});
        });

        return data;
    }
}
