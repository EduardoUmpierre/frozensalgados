import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { ApiProvider } from "../../providers/api/api";
import { ProductFormPage } from "../products/form/product-form";

/**
 * Generated class for the SellersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-sellers',
    templateUrl: 'sellers.html',
})
export class SellersPage {
    user: any = {};
    sellers = [];
    loaded: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, public storage: Storage, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        this.storage.get('user').then((user) => this.user = user);
        this.apiProvider.builder('sellers').loader().get().subscribe((res) => {
            this.sellers = res;
            this.loaded = true;
        });
    }

    /**
     * Push to customer form page
     *
     * @param {number} id
     */
    goToForm(id: number = null) {
        this.navCtrl.push(ProductFormPage, {id: id});
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
                            message: 'Deseja remover esse vendedor?',
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel'
                                },
                                {
                                    text: 'Remover',
                                    handler: () => {
                                        this.apiProvider.builder('sellers/' + id).loader().delete().subscribe((res) => this.remove(key));
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
        if (this.sellers[key]) {
            this.sellers.splice(key, 1);
        }
    }
}
