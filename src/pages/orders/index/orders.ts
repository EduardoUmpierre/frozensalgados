import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderViewPage } from '../view/order-view';
import { OrderFormPage } from '../form/order-form';
import { SyncProvider } from "../../../providers/sync/sync";
import { Storage } from "@ionic/storage";
import { ApiProvider } from "../../../providers/api/api";

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {
    currentUser: any = {};
    orders = [];
    filteredItems = [];
    loaded: boolean = false;

    constructor(public navCtrl: NavController, private navParams: NavParams, private syncProvider: SyncProvider,
                private actionSheetCtrl: ActionSheetController, private storage: Storage, private apiProvider: ApiProvider) {
        this.storage.get('user').then((user) => this.currentUser = user);
    }

    /**
     * Gets the order list
     */
    ionViewWillEnter() {
        this.syncProvider
            .verifySync('orders', this.navParams.get('force'))
            .then(orders => {
                this.orders = orders;
                this.filteredItems = orders;
            })
            .then(() => this.loaded = true)
            .catch((error) => console.log(error));
    }

    /**
     * Push to order details page
     *
     * @param id
     */
    goToDetails(id) {
        this.navCtrl.push(OrderViewPage, {id: id});
    }

    /**
     * Push to order form page
     *
     * @param {number} id
     */
    goToForm(id: number = null) {
        this.navCtrl.push(OrderFormPage, {id: id});
    }

    /**
     * Updates the orders with the refresher
     */
    doRefresh() {
        this.syncProvider
            .verifySync('orders', true)
            .then(orders => {
                this.orders = orders;
                this.filteredItems = orders;
            })
            .catch((error) => console.log(error));
    }

    /**
     * @param ev
     * @returns {any[]}
     */
    filterItems(ev: any) {
        let val = ev.target.value;

        this.filteredItems = this.orders.filter((item) => item.customer.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
    }

    /**
     * @param {number} id
     * @param {number} key
     */
    showOptions(id: number, key: number) {
        let buttons: any[] = [
            {
                text: 'Marcar como' + (this.orders[key].was_read ? ' não ' : ' ') + 'lido',
                handler: () => this.markAsRead(id, key)
            },
            {
                text: 'Cancelar',
                role: 'cancel'
            }
        ];

        if (this.currentUser.role == 1) {
            buttons.push({
                text: 'Editar',
                handler: () => this.goToForm(id)
            });
        }

        let actionSheet = this.actionSheetCtrl.create({
            title: 'Opções',
            buttons: buttons
        });

        actionSheet.present();
    }

    /**
     * @param {number} id
     * @param {number} key
     */
    markAsRead(id: number, key: number) {
        this.apiProvider.builder('orders/read').loader().post({id: id}).subscribe((res) => {
            const newWasReadValue = res.was_read;

            this.syncProvider.syncCategories(['orders'], true, false)
                .then((res) => {
                    this.orders[key].was_read = newWasReadValue;
                })
                .catch((error) => console.log(error))
        });
    }
}
