import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import { CustomersPage } from "../index/customers";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { CepProvider } from "../../../providers/api/cep";

/**
 * Generated class for the CustomerFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-customer-form',
    templateUrl: 'customer-form.html',
})
export class CustomerFormPage {
    pageTitle = 'Novo cliente';
    customer: any = {};

    private form: FormGroup;
    private id: number = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private formBuilder: FormBuilder, private cepProvider: CepProvider) {
        if (navParams.get('id')) {
            this.pageTitle = 'Editar cliente';
            this.id = navParams.get('id');
        }

        this.form = this.formBuilder.group({
            name: new FormControl('', Validators.compose([
                Validators.pattern('[a-zA-Z ]*'),
                Validators.required
            ])),
            cnpj: new FormControl(''),
            phone: new FormControl(''),
            cep: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            address_number: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            district: new FormControl('', Validators.required)
        });
    }

    ionViewDidLoad() {
        if (this.id) {
            this.apiProvider.builder('customers/' + this.id).loader().get({'lists': 0}).subscribe((res) => {
                this.form.controls['name'].setValue(res.name);
                this.form.controls['cnpj'].setValue(res.cnpj);
                this.form.controls['phone'].setValue(res.phone);
                this.form.controls['cep'].setValue(res.cep);
                this.form.controls['address'].setValue(res.address);
                this.form.controls['address_number'].setValue(res.address_number);
                this.form.controls['city'].setValue(res.city);
                this.form.controls['district'].setValue(res.district);
            });
        }
    }

    /**
     * Submit function
     */
    submit() {
        if (this.id) {
            this.apiProvider.builder('customers/' + this.id).loader().put(Object.assign({}, {id: this.id}, this.form.value)).subscribe((res) => this.redirect());
        } else {
            this.apiProvider.builder('customers').loader().post(this.form.value).subscribe((res) => this.redirect());
        }
    }

    redirect() {
        this.navCtrl.push(CustomersPage).then(() => {
            this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
        });
    }

    /**
     * Fetch address by CEP function
     */
    fetchAddress() {
        console.log(this.form.controls.cep.value);

        this.cepProvider.loader().get('/cep/ws/' + this.form.controls.cep.value + '/json/').subscribe((res) => {
            console.log(res);
            this.form.controls['address'].setValue(res.logradouro);
            this.form.controls['city'].setValue(res.localidade);
            this.form.controls['district'].setValue(res.bairro);
        });
    }
}
