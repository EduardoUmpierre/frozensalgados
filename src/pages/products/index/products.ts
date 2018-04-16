import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { Storage } from "@ionic/storage";
import { ProductFormPage } from "../form/product-form";
import { CategoryFormPage } from "../../categories/form/category-form";
import { SyncProvider } from "../../../providers/sync/sync";

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
    categories = [];
    loaded: boolean = false;
    tab: string = 'products';
    pageTitle: string;

    constructor(public navCtrl: NavController, private apiProvider: ApiProvider, public storage: Storage,
                public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,
                private syncProvider: SyncProvider, private navParams: NavParams) {
        this.storage.get('user').then((user) => this.currentUser = user);

        let tab = this.navParams.get('tab');

        if (tab) {
            this.tab = tab;
        }

        this.updatePageTitle(this.tab);
    }

    /**
     *
     */
    ionViewWillEnter() {
        this.syncProvider
            .verifySync('products', !!this.navParams.get('force'))
            .then(products => {
                this.products = products;

                this.syncProvider
                    .verifySync('categories', !!this.navParams.get('force'))
                    .then(categories => this.categories = categories)
                    .then(() => this.loaded = true)
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    }

    /**
     * Push to customer form page
     *
     * @param {number} id
     */
    goToForm(id: number = null) {
        if (this.isProduct()) {
            this.navCtrl.push(ProductFormPage, {id: id});
        } else {
            this.navCtrl.push(CategoryFormPage, {id: id});
        }
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
                                        if (this.isProduct()) {
                                            this.apiProvider.builder('products/' + id).loader().delete().subscribe((res) => this.remove(key));
                                        } else {
                                            this.apiProvider.builder('categories/' + id).loader().delete().subscribe((res) => this.remove(key));
                                        }
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
        if (this.isProduct()) {
            if (this.products[key]) {
                this.products.splice(key, 1);
            }
        } else {
            if (this.categories[key]) {
                this.categories.splice(key, 1);
            }
        }
    }

    /**
     * Updates the products with the refresher
     *
     * @param refresher
     */
    doRefresh(refresher) {
        if (this.isProduct()) {
            this.syncProvider
                .verifySync('products', true, false)
                .then(products => this.products = products)
                .then(() => refresher.complete())
                .catch((error) => console.log(error));
        } else {
            this.syncProvider
                .verifySync('categories', true, false)
                .then(categories => this.categories = categories)
                .then(() => refresher.complete())
                .catch((error) => console.log(error));
        }
    }

    /**
     *
     * @param event
     */
    segmentChanged(event) {
        this.updatePageTitle(event.value);
    }

    /**
     *
     * @param tab
     */
    updatePageTitle(tab) {
        this.pageTitle = tab == 'products' ? 'Produtos' : 'Categorias';
    }

    /**
     *
     * @returns {boolean}
     */
    isProduct() {
        return this.tab == 'products';
    }
}
