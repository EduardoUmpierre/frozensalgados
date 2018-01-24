import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { OrderProductModalPage } from "../order-product-modal/order-product-modal";
import { Product } from "../../models/Product";
import { OrdersPage } from "../orders/orders";
import { ApiProvider } from "../../providers/api/api";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the ListFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-list-form',
    templateUrl: 'list-form.html',
})
export class ListFormPage {
    pageTitle = 'Criar lista';
    customer: number;
    previousPage;
    options: {};
    user: any = {};

    list = {
        title: '',
        order: []
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public apiProvider: ApiProvider, public storage: Storage) {
        if (navParams.get('list')) {
            this.pageTitle = 'Editar lista';
        }

        this.storage.get('user').then((user) => this.user = user);

        this.previousPage = navCtrl.getPrevious();
        this.list.order = navParams.get('order');
        this.customer = navParams.get('customer');

        if (this.previousPage.instance instanceof OrdersPage) {
            this.options = {
                id: navParams.get('orderId')
            };
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ListFormPage');
    }

    /**
     * Loads the product modal
     */
    loadProductModal() {
        let productModal = this.modalCtrl.create(OrderProductModalPage);

        productModal.onDidDismiss(data => {
            if (data instanceof Product) {
                this.list.order.push(data);
            }
        });

        productModal.present();
    }

    /**
     * Creates the order and redirects to the orders page
     */
    create() {
        let data = {
            customer: this.customer,
            user: this.user.id,
            title: this.list.title,
            order: this.normalizeOrderData(this.list.order)
        };

        this.apiProvider.builder('lists').loader().post(data).then((res) => {
            this.navCtrl.push(this.previousPage.component, this.options).then(() => {
                this.navCtrl.remove(this.navCtrl.getActive().index - 3, 3);
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

        order.forEach(function (e) {
            data.push({id: e.product ? e.product.id : e.id, qnt: e.quantity});
        });

        return data;
    }
}
