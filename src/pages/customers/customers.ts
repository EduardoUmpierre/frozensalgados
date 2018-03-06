import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { CustomerViewPage } from "../customer-view/customer-view";
import { Storage } from "@ionic/storage";
import { CustomerFormPage } from "../customer-form/customer-form";

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
    user: any = {};
    customers = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, public storage: Storage, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
    }

    /**
     * Called when the view is loaded
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad CustomersPage');

        this.apiProvider.builder('customers').loader().get().subscribe((res) => this.customers = res);
        this.storage.get('user').then((user) => this.user = user);
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
}
