import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiProvider } from "../../../providers/api/api";
import { ProductsPage } from "../../products/index/products";
import { SyncProvider } from "../../../providers/sync/sync";

/**
 * Generated class for the CategoryFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-category-form',
    templateUrl: 'category-form.html',
})
export class CategoryFormPage {
    private pageTitle: string = 'Nova categoria';
    private id: number;
    private form: FormGroup;

    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
                private apiProvider: ApiProvider, private syncProvider: SyncProvider) {
        if (navParams.get('id')) {
            this.pageTitle = 'Editar categoria';
            this.id = navParams.get('id');
        }

        this.form = this.formBuilder.group({
            name: new FormControl('', Validators.required)
        });
    }

    /**
     *
     */
    ionViewWillEnter() {
        if (this.id) {
            this.apiProvider.builder('categories/' + this.id).loader().get().subscribe(res => this.form.controls['name'].setValue(res.name));
        }
    }

    /**
     * Submit function
     */
    submit() {
        if (this.id) {
            this.apiProvider.builder('categories/' + this.id).loader().put(Object.assign({}, {id: this.id}, this.form.value)).subscribe(res => this.redirect());
        } else {
            this.apiProvider.builder('categories').loader().post(this.form.value).subscribe(res => this.redirect());
        }
    }

    /**
     *
     */
    redirect() {
        this.syncProvider.verifySync('categories', true).then(() => {
            this.navCtrl.push(ProductsPage, {force: true, tab: 'categories'}).then(() => {
                this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
            });
        }).catch(error => console.log(error));
    }
}
