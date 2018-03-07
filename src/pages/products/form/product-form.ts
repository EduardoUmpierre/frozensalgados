import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import { ProductsPage } from "../../products/index/products";

/**
 * Generated class for the ProductFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-product-form',
    templateUrl: 'product-form.html',
})
export class ProductFormPage {
    pageTitle = 'Novo produto';
    product = {};

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
        if (navParams.get('id')) {
            this.pageTitle = 'Editar produto';
        }
    }

    ionViewDidLoad() {
        if (this.navParams.get('id')) {
            this.apiProvider.builder('products/' + this.navParams.get('id')).loader().get().subscribe((res) => this.product = res);
        }
    }

    /**
     * Submit function
     */
    submit() {
        if (this.navParams.get('id')) {
            this.apiProvider.builder('products/' + this.navParams.get('id')).loader().put(this.product).subscribe((res) => this.redirect());
        } else {
            this.apiProvider.builder('products').loader().post(this.product).subscribe((res) => this.redirect());
        }
    }

    redirect() {
        this.navCtrl.push(ProductsPage).then(() => {
            this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
        });
    }
}
