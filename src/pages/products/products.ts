import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the ProductsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    public products;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
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
            .builder('products')
            .loader()
            .get()
            .then((res) => this.products = res);
    }
}
