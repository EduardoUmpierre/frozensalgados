import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

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

    constructor(private apiProvider: ApiProvider) {
    }

    ionViewDidLoad() {
        this.apiProvider.builder('products').loader().get().subscribe((res) => this.products = res);
    }

}
