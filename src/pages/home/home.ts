import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CustomersPage} from '../customers/customers';
import {OrdersPage} from '../orders/orders';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController) {

    }

    // Push another page onto the history stack
    // Causing the nav controller to animate the new page in
    goToCustomers() {
        this.navCtrl.push(CustomersPage);
    }

    goToOrders() {
        this.navCtrl.push(OrdersPage);
    }
}
