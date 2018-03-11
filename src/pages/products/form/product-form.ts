import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import { ProductsPage } from "../index/products";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";

/**
 * Generated class for the ProductFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-product-form',
    templateUrl: 'product-form.html',
})
export class ProductFormPage {
    private pageTitle = 'Novo produto';
    private form: FormGroup;
    private id: number = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private formBuilder: FormBuilder) {
        if (navParams.get('id')) {
            this.pageTitle = 'Editar produto';
            this.id = navParams.get('id');
        }

        this.form = this.formBuilder.group({
            name: new FormControl('', Validators.required),
            price: new FormControl('', Validators.required)
        });
    }

    /**
     *
     */
    ionViewDidLoad() {
        if (this.id) {
            this.apiProvider.builder('products/' + this.id).loader().get().subscribe(res => {
                this.form.controls['name'].setValue(res.name);
                this.form.controls['price'].setValue(res.price);
            });
        }
    }

    /**
     * Submit function
     */
    submit() {
        if (this.id) {
            this.apiProvider.builder('products/' + this.id).loader().put(Object.assign({}, {id: this.id}, this.form.value)).subscribe(res => this.redirect());
        } else {
            this.apiProvider.builder('products').loader().post(this.form.value).subscribe(res => this.redirect());
        }
    }

    /**
     *
     */
    redirect() {
        this.navCtrl.push(ProductsPage).then(() => {
            this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
        });
    }
}
