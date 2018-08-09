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
import { Category } from "../../../models/Category";

@IonicPage()
@Component({
    selector: 'page-order-form',
    templateUrl: 'order-form.html',
})
export class OrderFormPage {
    private form: FormGroup;
    private pageTitle: String = 'Criar pedido';
    private customers = [];
    private order: Product[] = [];
    private orders = [];
    private paymentDays = 1;
    private id = null;

    tab: string = 'info';
    order_total: number = 0.00;
    currentOrder: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider,
                public storage: Storage, public modalCtrl: ModalController, private alertCtrl: AlertController,
                public actionSheetCtrl: ActionSheetController, private syncProvider: SyncProvider,
                private formBuilder: FormBuilder) {
        moment.locale('pt-BR');

        let today = moment();

        this.form = this.formBuilder.group({
            customer: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
            delivery_date: new FormControl(today.format(), Validators.required),
            payment_method: new FormControl('', Validators.required),
            payment_date: new FormControl(today.add(1, 'days').format(), Validators.required),
            installments: new FormControl(1, Validators.required),
            comments: new FormControl('')
        });
    }

    ionViewDidLoad() {
        this.id = this.navParams.get('id');

        if (this.id) {
            this.pageTitle = 'Editar pedido';

            this.apiProvider.builder('orders/' + this.id).loader().get().subscribe((order) => {
                const deliveryDate = moment(order.delivery_date);
                const paymentDate = moment(order.payment_date);

                this.form.controls['customer'].setValue(order.customer);
                this.form.controls['status'].setValue(order.status);
                this.form.controls['delivery_date'].setValue(deliveryDate.format('YYYY-MM-DD'));
                this.form.controls['payment_date'].setValue(paymentDate.format('YYYY-MM-DD'));
                this.form.controls['payment_method'].setValue(order.payment_method);
                this.form.controls['installments'].setValue(order.installments);
                this.form.controls['comments'].setValue(order.comments);

                let orderProducts = [];

                order.order_product.forEach((e) => {
                    orderProducts.push(new Product(e.product.id, e.product.name, e.product.image, e.unit_price, e.quantity, e.product.weight));
                });

                this.order = orderProducts;
                this.paymentDays = paymentDate.diff(deliveryDate, 'days');

                this.updateTotal();
            });
        }

        const customer = this.navParams.get('customer');

        if (customer) {
            this.form.controls['customer'].setValue(customer);
        }
    }

    /**
     * Gets the order list
     */
    ionViewWillEnter() {
        this.syncProvider
            .verifySync('customers')
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

        event.component.items = this.customers.filter(item => item.name.toLowerCase().indexOf(id.toLowerCase()) !== -1 || item.id.toString().indexOf(id) !== -1);

        event.component.isSearching = false;
    }

    /**
     * Loads the customer's orders
     *
     * @param event
     */
    searchCustomerOrders(event: { component: SelectSearchable, value: any }) {
        this.order = [];
        this.updateTotal();

        this.apiProvider.builder('orders/customer/' + event.value.id).get().subscribe((orders) => {
            orders.forEach((e, i) => {
                e.created_at = moment(e.created_at).format('DD/MM/YYYY HH:mm:ss');
                orders[i] = e;
            });

            this.orders = orders;
        });
    }

    /**
     * @param selectedValue
     */
    loadOrder(selectedValue: any) {
        this.currentOrder = selectedValue;

        this.apiProvider.builder('orders/' + selectedValue + '/products').get().subscribe((res) => {
            let updatedOrder = [];
            this.order = [];

            res.order_product.forEach((e) => updatedOrder.push(new Product(e.product.id, e.product.name, '', e.product.price, e.quantity, e.product.weight, new Category(e.product.category.id, e.product.category.name))));

            this.order = updatedOrder;
            this.updateTotal();
        });
    }

    /**
     * Loads the product modal
     */
    loadProductModal(data = {}) {
        let productModal = this.modalCtrl.create(OrderProductModalPage, data);

        productModal.onDidDismiss(data => {
            if (data instanceof Product) {
                let products = this.order.filter(item => item.id == data.id);

                if (products.length > 0) {
                    let alert = this.alertCtrl.create({
                        title: 'Item duplicado',
                        message: 'Este produto já consta no pedido',
                        buttons: [
                            {
                                text: 'OK',
                                handler: () => {
                                    this.loadProductModal({product: data});
                                }
                            }
                        ]
                    });

                    alert.present();
                } else {
                    this.order.push(data);
                    this.updateTotal();
                }
            }
        });

        productModal.present();
    }

    /**
     * Creates the order and redirects to the orders page
     */
    create() {
        if (this.order.length > 0) {
            let data = Object.assign({}, {order: this.normalizeOrderData(this.order)}, this.form.value)

            if (this.id) {
                this.apiProvider.builder('orders/' + this.id).loader().put(Object.assign({}, {id: this.id}, data)).subscribe((res) => this.redirect());
            } else {
                this.apiProvider.builder('orders').loader().post(data).subscribe((res) => this.redirect());
            }
        } else {
            let alert = this.alertCtrl.create({
                title: 'Atenção',
                message: 'É necessário adicionar no mínimo um produto.',
                buttons: [
                    {
                        text: 'Ok',
                        handler: () => {
                            this.tab = 'products'
                        }
                    }
                ]
            });

            alert.present();
        }
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
            data.push({id: e.id, qnt: e.quantity, price: e.price});
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

    /**
     * @param event
     */
    updateDeliveryDate(event: any) {
        let deliveryDate = moment([event.year, event.month - 1, event.day]);

        this.form.controls['payment_date'].setValue(deliveryDate.add(this.paymentDays, 'days').format());
    }

    /**
     * @param event
     */
    updatePaymentDate(event: any) {
        let days = event.target.value;

        if (days && days > 0 && days.trim() !== '') {
            let newDate = moment(this.form.controls['delivery_date'].value).add(days, 'days').format();

            this.form.controls['payment_date'].setValue(newDate);
        }
    }

    /**
     * @param event
     */
    updatePaymentDays(event: any) {
        let deliveryDate = moment(moment(this.form.controls['delivery_date'].value).format('YYYY-MM-DD'));
        let paymentDate = moment(moment([event.year, event.month - 1, event.day]).format('YYYY-MM-DD'));

        this.paymentDays = paymentDate.diff(deliveryDate, 'days');
    }

    /**
     * Redirect to orders page
     */
    redirect() {
        this.syncProvider.verifySync('orders', true).then(() => {
            this.navCtrl.push(OrdersPage, {force: true}).then(() => {
                this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
            });
        }).catch(error => console.log(error));
    }
}
