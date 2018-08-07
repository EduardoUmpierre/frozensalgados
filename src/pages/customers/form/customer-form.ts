import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import { CustomersPage } from "../index/customers";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { ExternalProvider } from "../../../providers/api/external";
import { SyncProvider } from "../../../providers/sync/sync";
import { Storage } from "@ionic/storage";

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
    private pageTitle = 'Novo cliente';
    private form: FormGroup;
    private id: number = null;
    private sellers = [];
    private user;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider,
                private formBuilder: FormBuilder, private externalProvider: ExternalProvider,
                private syncProvider: SyncProvider, private storage: Storage) {
        if (navParams.get('id')) {
            this.pageTitle = 'Editar cliente';
            this.id = navParams.get('id');
        }

        this.form = this.formBuilder.group({
            user_id: new FormControl(''),
            name: new FormControl('', Validators.required),
            cnpj: new FormControl('', Validators.compose([
                Validators.minLength(18),
                Validators.required
            ])),
            phone: new FormControl(''),
            cep: new FormControl('', Validators.compose([
                Validators.minLength(10),
                Validators.required
            ])),
            address: new FormControl('', Validators.required),
            address_number: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            district: new FormControl('', Validators.required),
            ie: new FormControl(''),
            ie_exempt: new FormControl({value: 0, disabled: false})
        });
    }

    /**
     *
     */
    ionViewDidLoad() {
        this.storage.get('user').then((user) => {
            this.user = user;

            if (user.role != 1) {
                this.form.controls['user_id'].setValue(user.id);
            } else {
                this.syncProvider.verifySync('users').then((sellers) => this.sellers = sellers);
            }
        });

        if (this.id) {
            this.apiProvider.builder('customers/' + this.id).loader().get().subscribe((res) => {
                this.form.controls['user_id'].setValue(res.user_id);
                this.form.controls['name'].setValue(res.name);
                this.form.controls['cnpj'].setValue(res.cnpj);
                this.form.controls['phone'].setValue(res.phone);
                this.form.controls['cep'].setValue(res.cep);
                this.form.controls['address'].setValue(res.address);
                this.form.controls['address_number'].setValue(res.address_number);
                this.form.controls['city'].setValue(res.city);
                this.form.controls['district'].setValue(res.district);
                this.form.controls['ie'].setValue(res.ie);
                this.form.controls['ie_exempt'].setValue(res.ie_exempt);
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

    /**
     *
     */
    redirect() {
        this.navCtrl.push(CustomersPage, {force: true}).then(() => {
            this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
        });
    }

    /**
     * Fetch customer data by CNPJ
     */
    fetchCustomer() {
        this.externalProvider.loader().getExternal('receita', '/v1/cnpj/' + this.form.controls.cnpj.value.replace(/[^a-zA-Z0-9]/g, "")).subscribe(res => {
            if (res.status != "OK") {
                this.externalProvider.showAlert(res.message);
            } else {
                this.form.controls['name'].setValue(res.nome);
                this.form.controls['phone'].setValue(res.telefone);
                this.form.controls['cep'].setValue(res.cep);
                this.form.controls['address'].setValue(res.logradouro);
                this.form.controls['address_number'].setValue(res.numero);
                this.form.controls['city'].setValue(res.municipio);
                this.form.controls['district'].setValue(res.bairro);
            }
        });
    }

    /**
     * Fetch address by CEP
     */
    fetchAddress() {
        this.externalProvider.loader().getExternal('cep', '/ws/' + this.form.controls.cep.value.replace(/[^a-zA-Z0-9]/g, "") + '/json/').subscribe((res) => {
            if (res.erro) {
                this.externalProvider.showAlert('CEP inválido');
            } else {
                this.form.controls['address'].setValue(res.logradouro);
                this.form.controls['city'].setValue(res.localidade);
                this.form.controls['district'].setValue(res.bairro);
            }
        });
    }
}
