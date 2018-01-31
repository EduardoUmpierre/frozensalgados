import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, AlertController } from 'ionic-angular';
import { SelectSearchable } from '../../components/select/select';
import { ApiProvider } from "../../providers/api/api";
import { OrderProductModalPage } from '../order-product-modal/order-product-modal';
import { OrdersPage } from "../orders/orders";
import { Product } from "../../models/Product";

/**
 * Generated class for the OrderFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-order-form',
    templateUrl: 'order-form.html',
})
export class OrderFormPage {
    pageTitle = 'Criar pedido';
    customer;
    lists = [];
    order: Product[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
        if (navParams.get('product')) {
            this.pageTitle = 'Editar pedido';
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderFormPage');

        console.log(this.order);
    }

    /**
     * Loads the customer data
     *
     * @param event
     */
    searchCustomers(event: { component: SelectSearchable, text: string }) {
        let id = event.text || '';

        event.component.isSearching = true;
        this.order = [];

        this.apiProvider.builder('customers').get({id: id}).subscribe((customers) => {
            event.component.items = customers;
            event.component.isSearching = false;
        });
    }

    /**
     * Loads the customer's order lists
     *
     * @param event
     */
    searchCustomerLists(event: { component: SelectSearchable, value: any }) {
        this.order = [];

        this.apiProvider.builder('lists').get({customer: event.value.id}).subscribe((lists) => {
            this.lists = lists;
        });
    }

    loadList(selectedValue: any) {
        console.log('Selected', selectedValue);

        this.apiProvider.builder('lists/' + selectedValue).get().subscribe((res) => {
            console.log(res);

            this.order = [];

            let updatedOrder = [];

            res.list_product.forEach(function (e, i) {
                updatedOrder.push(new Product(e.product.id, e.product.name, '', e.product.price, e.quantity));
            });

            this.order = updatedOrder;

            console.log(this.order);
        });
    }

    /**
     * Loads the product modal
     */
    loadProductModal() {
        let productModal = this.modalCtrl.create(OrderProductModalPage);

        productModal.onDidDismiss(data => {
            if (data instanceof Product) {
                this.order.push(data);
            }
        });

        productModal.present();
    }

    /**
     * Creates the order and redirects to the orders page
     */
    create() {
        let data = {customer: this.customer.id, order: this.normalizeOrderData(this.order)};

        this.apiProvider.builder('orders').loader().post(data).subscribe((res) => {
            this.navCtrl.push(OrdersPage).then(() => {
                this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
            });
        });
    }

    /**
     * Removes the unnecessary data from the array
     *
     * @param order
     * @returns {Array}
     */
    normalizeOrderData(order) {
        let data = [];

        order.forEach(function (e, i) {
            data.push({id: e.id, qnt: e.quantity});
        });

        return data;
    }

    showOptions(id: number) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Opções',
            buttons: [
                {
                    text: 'Editar',
                    handler: () => {
                        console.log('Archive clicked');
                    }
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
                                        this.removeFromOrder(id);
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

    removeFromOrder(id: number) {
        this.order.forEach((e, i) => {
            console.log(i, e);

           if (e.id == id) {
               console.log(i);
               console.log(id);

               this.order = this.order.splice(i - 1, 1);

               return;
           }
        });
    }
}
