import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    ModalController,
    ActionSheetController,
    AlertController
} from 'ionic-angular';
import { SelectSearchable } from '../../../components/select/select';
import { ApiProvider } from "../../../providers/api/api";
import { OrderProductModalPage } from '../modal/order-product-modal';
import { OrdersPage } from "../index/orders";
import { Product } from "../../../models/Product";
import { Storage } from "@ionic/storage";
import { SyncProvider } from "../../../providers/sync/sync";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment';
import 'moment/locale/pt-br';

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
    private form: FormGroup;
    private pageTitle: String = 'Criar pedido';
    private customers = [];
    private customer;
    private order: Product[] = [];
    private orders = [];

    tab: string = 'info';
    order_total: number = 0.00;
    currentOrder: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider,
                public storage: Storage, public modalCtrl: ModalController, private alertCtrl: AlertController,
                public actionSheetCtrl: ActionSheetController, private syncProvider: SyncProvider,
                private formBuilder: FormBuilder) {
        if (this.navParams.get('product')) {
            this.pageTitle = 'Editar pedido';
        }

        moment.locale('pt-BR');

        const today = moment().format();

        this.form = this.formBuilder.group({
            customer: new FormControl('', Validators.required),
            payment_method: new FormControl('', Validators.required),
            payment_date: new FormControl(today, Validators.required),
            installments: new FormControl(1, Validators.required),
            delivery_date: new FormControl(today, Validators.required),
            comments: new FormControl('')
        });
    }

    /**
     * Gets the order list
     */
    ionViewWillEnter() {
        this.syncProvider
            .verifySync('all_customers')
            .then(customers => this.customers = customers)
            .catch((error) => console.log(error));
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
        this.currentOrder = 0;

        if (id && id.trim() != '') {
            event.component.items = this.customers.filter(item => item.name.toLowerCase().indexOf(id.toLowerCase()) !== -1 || item.id.toString().indexOf(id) !== -1);

            event.component.isSearching = false;
        }
    }

    /**
     * Loads the customer's orders
     *
     * @param event
     */
    searchCustomerOrders(event: { component: SelectSearchable, value: any }) {
        this.order = [];

        this.apiProvider.builder('orders/customer/' + event.value.id).get().subscribe((orders) => {
            console.log(orders);

            orders.forEach((e, i) => {
               e.created_at = moment(e.created_at).format('DD/MM/YYYY H:m:s');

               orders[i] = e;
            });

            this.orders = orders;
        });
    }

    /**
     *
     * @param selectedValue
     */
    loadOrder(selectedValue: any) {
        this.currentOrder = selectedValue;

        this.apiProvider.builder('orders/' + selectedValue + '/products').get().subscribe((res) => {
            let updatedOrder = [];
            this.order = [];

            res.order_product.forEach((e) => updatedOrder.push(new Product(e.product.id, e.product.name, '', e.product.price, e.quantity)));

            this.order = updatedOrder;
            this.updateTotal();
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
                this.updateTotal();
            }
        });

        productModal.present();
    }

    /**
     * Creates the order and redirects to the orders page
     */
    create() {
        let data = Object.assign({}, {order: this.normalizeOrderData(this.order)}, this.form.value)

        this.apiProvider.builder('orders').loader().post(data).subscribe((res) => {
            this.syncProvider.verifySync('customers', true).then(() => {
                this.navCtrl.push(OrdersPage, {force: true}).then(() => {
                    this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
                });
            }).catch(error => console.log(error));
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

        order.forEach((e, i) => {
            data.push({id: e.id, qnt: e.quantity});
        });

        return data;
    }

    /**
     *
     * @param {number} id
     * @param {number} key
     */
    showOptions(id: number, key: number) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Opções',
            buttons: [
                {
                    text: 'Editar',
                    handler: () => {
                        let productModal = this.modalCtrl.create(OrderProductModalPage, {product: this.order[key]});

                        productModal.onDidDismiss(data => {
                            if (data instanceof Product) {
                                this.order[key] = data;
                                this.updateTotal();
                            }
                        });

                        productModal.present();
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
                                        this.removeFromOrder(key);
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
    removeFromOrder(key: number) {
        if (this.order[key]) {
            this.order.splice(key, 1);
            this.updateTotal();
        }
    }

    /**
     *
     */
    updateTotal() {
        this.order_total = 0;
        this.order.forEach((e, i) => this.order_total += e.price * e.quantity);
    }
}
