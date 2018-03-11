import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { Storage } from "@ionic/storage";
import { ProductFormPage } from "../form/product-form";

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
    currentUser: any = {};
    products = [];
    loaded: boolean = false;

    constructor(public navCtrl: NavController, private apiProvider: ApiProvider, public storage: Storage, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        this.storage.get('user').then((user) => this.currentUser = user);

        this.apiProvider.builder('products').loader().get().subscribe((res) => {
            this.products = res;
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
                            message: 'Deseja remover esse produto?',
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel'
                                },
                                {
                                    text: 'Remover',
                                    handler: () => {
                                        this.apiProvider.builder('products/' + id).loader().delete().subscribe((res) => this.remove(key));
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
        if (this.products[key]) {
            this.products.splice(key, 1);
        }
    }
}