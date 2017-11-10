import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomersPage } from '../customers/customers';
import { OrdersPage } from '../orders/orders';
import { ProductsPage } from "../products/products";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl:NavController) {
    }

    // Push another page onto the history stack
    // Causing the nav controller to animate the new page in

    /**
     * Push to customer list page
     */
    goToCustomers() {
        this.navCtrl.push(CustomersPage);
    }

    /**
     * Push to order list page
     */
    goToOrders() {
        this.navCtrl.push(OrdersPage);
    }

    /**
     * Push to product list page
     */
    goToProducts() {
        this.navCtrl.push(ProductsPage);
    }
}
