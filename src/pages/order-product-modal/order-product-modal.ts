import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SelectSearchable } from '../../components/select/select';
import { ApiProvider } from "../../providers/api/api";
import { Product } from "../../models/Product";

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

    private order: Product;

    constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider, public viewCtrl: ViewController) {
        if (navParams.get('product')) {
            this.pageTitle = 'Editar produto';
        } else {
            this.order = new Product();
            this.order.quantity = 1;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderProductModalPage');
        console.log(this.order);
    }

    searchProducts(event: { component: SelectSearchable, text: string }) {
        let name = event.text || '';

        event.component.isSearching = true;

        this.apiProvider.builder('products', 'name=' + name).get().then((products) => {
            event.component.items = products;
            event.component.isSearching = false;
        });
    }

    updateProduct(event: { component: SelectSearchable, value: any }) {
        const product = event.value;

        this.order = Object.assign(this.order, product);
        this.order.image = 'http://www.placehold.it/60';

        console.log('value:', product);
    }

    dismiss() {
        console.log('Order: ', this.order);

        if (this.order.validate()) {
            this.viewCtrl.dismiss(this.order);
        } else {

        }
    }
}
