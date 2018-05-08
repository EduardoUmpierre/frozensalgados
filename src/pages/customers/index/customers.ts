import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { CustomerViewPage } from "../view/customer-view";
import { Storage } from "@ionic/storage";
import { CustomerFormPage } from "../form/customer-form";
import { SyncProvider } from "../../../providers/sync/sync";

/**
 * Generated class for the CustomersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-customers',
    templateUrl: 'customers.html',
})
export class CustomersPage {
    currentUser: any = {};
    customers = [];
    loaded: boolean = false;

    constructor(private navCtrl: NavController, private navParams: NavParams, private apiProvider: ApiProvider,
                private storage: Storage, private actionSheetCtrl: ActionSheetController,
                private alertCtrl: AlertController, private syncProvider: SyncProvider) {
        this.storage.get('user').then((user) => this.currentUser = user);
    }

    /**
     *
     */
    ionViewWillEnter() {
        this.syncProvider
            .verifySync('customers', this.navParams.get('force'))
            .then(customers => this.customers = customers)
            .then(() => this.loaded = true)
            .catch((error) => console.log(error));
    }

    /**
     * Push to customer details page
     *
     * @param id
     */
    goToDetails(id) {
        this.navCtrl.push(CustomerViewPage, {id: id});
    }

    /**
     * Push to customer form page
     *
     * @param {number} id
     */
    goToForm(id: number = null) {
        this.navCtrl.push(CustomerFormPage, {id: id});
    }

    /**
     * @param {number} id
     * @param {number} key
     */
    showOptions(id: number, key: number) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Opções',
            buttons: [
                {
                    text: 'Editar',
                    handler: () => this.goToForm(id)
                },
                {
                    text: 'Excluir',
                    role: 'destructive',
                    handler: () => {
                        let alert = this.alertCtrl.create({
                            title: 'Confirmar exclusão',
                            message: 'Deseja remover esse cliente?',
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel'
                                },
                                {
                                    text: 'Remover',
                                    handler: () => {
                                        this.apiProvider.builder('customers/' + id).loader().delete().subscribe((res) => this.remove(key));
                                    }
                                }
                            ]
                        });

                        alert.present();
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel'
                }
            ]
        });

        actionSheet.present();
    }

    /**
     * Removes a order item
     *
     * @param {number} key
     */
    remove(key: number) {
        if (this.customers[key]) {
            this.customers.splice(key, 1);
        }
    }

    /**
     * Updates the customer with the refresher
     *
     * @param refresher
     */
    doRefresh(refresher) {
        this.syncProvider
            .verifySync('customers', true, false)
            .then(customers => this.customers = customers)
            .then(() => refresher.complete())
            .catch((error) => console.log(error));
    }
}
