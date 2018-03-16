import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {SelectSearchable} from '../../../components/select/select';
import {ApiProvider} from "../../../providers/api/api";
import {Product} from "../../../models/Product";

/**
 * Generated class for the OrderProductModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-order-product-modal',
    templateUrl: 'order-product-modal.html',
})
export class OrderProductModalPage {
    pageTitle = 'Adicionar produto';
    order: Product;
    quantity: number;

    constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider, public viewCtrl: ViewController) {
        if (navParams.get('product')) {
            this.pageTitle = 'Editar produto';
            this.order = navParams.get('product');
            this.quantity = this.order.quantity;
        } else {
            this.order = new Product();
            this.quantity = 1;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderProductModalPage');
        console.log(this.order);
    }

    searchProducts(event: { component: SelectSearchable, text: string }) {
        let id = event.text || '';

        event.component.isSearching = true;

        this.apiProvider.builder('products').get({id: id}).subscribe((products) => {
            event.component.items = products;

            event.component.isSearching = false;
        });
    }

    updateProduct(event: { component: SelectSearchable, value: any }) {
        const product = event.value;

        this.order = Object.assign(this.order, product);
        this.order.image = 'assets/images/placeholder-60.jpg';
    }

    /**
     * Dissmiss product modal
     */
    dismiss() {
        console.log('Order: ', this.order);

        if (this.validate()) {
            this.viewCtrl.dismiss(new Product(this.order.id, this.order.name, this.order.image, this.order.price, this.quantity));
        }
    }

    /**
     * @returns {boolean}
     */
    validate() {
        return this.order.name !== null && this.quantity > 0;
    }
}
