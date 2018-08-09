import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { DownloadProvider } from "../../../providers/download/download";
import { OrderFormPage } from "../form/order-form";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
    selector: 'page-order-view',
    templateUrl: 'order-view.html',
})
export class OrderViewPage {
    public order;
    private id;
    private currentUser;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider,
                private downloadProvider: DownloadProvider, private storage: Storage) {
        this.storage.get('user').then((user) => {
            this.currentUser = user;
            console.log(user);
        });
    }

    /**
     * Gets one item by id
     */
    ionViewDidLoad() {
        this.id = this.navParams.get('id');

        this.apiProvider.builder('orders/' + this.id).loader().get().subscribe((res) => this.order = res);
    }

    /**
     * Push to order form page
     */
    goToForm() {
        this.navCtrl.push(OrderFormPage, {id: this.id});
    }

    /**
     * Calls the download method
     */
    download() {
        this.downloadProvider.download('orders/' + this.id + '/download', 'pedido-' + this.id);
    }
}
