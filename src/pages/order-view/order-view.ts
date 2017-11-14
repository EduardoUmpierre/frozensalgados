import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the OrderViewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-order-view',
    templateUrl: 'order-view.html',
})
export class OrderViewPage {

    public order;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderViewPage');

        this.loadItem(this.navParams.get('id'));
    }

    /**
     * Gets one item by id
     */
    loadItem(id) {
        this.apiProvider.builder('orders/' + id, null).loader('Carregando pedido ' + id + '...').get().then((res) => {
            console.log(res);
            this.order = res;
        });
    }
}
