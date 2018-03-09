import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import { UsersPage } from "../index/users";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the UserFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-user-form',
    templateUrl: 'user-form.html',
})
export class UserFormPage {
    pageTitle = 'Novo usuário';

    roles = [
        {title: 'Vendedor', id: 2},
        {title: 'Administrador', id: 1}
    ];

    user: any = {};

    private form: FormGroup;
    private id: number = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private formBuilder: FormBuilder, public storage: Storage) {
        if (navParams.get('id')) {
            this.pageTitle = 'Editar usuário';
            this.id = navParams.get('id');
        }

        this.form = this.formBuilder.group({
            name: new FormControl('', Validators.compose([
                Validators.pattern('[a-zA-Z ]*'),
                Validators.required
            ])),
            email: new FormControl('', Validators.required),
            cpf: new FormControl('', Validators.required),
            role: new FormControl('2', Validators.required),
            password: new FormControl('', Validators.required),
            passwordRepeat: new FormControl('', Validators.required)
        }, {validator: this.passwordsMatch});
    }

    passwordsMatch(cg: FormGroup): { [err: string]: any } {
        let pwd1 = cg.get('password');
        let pwd2 = cg.get('passwordRepeat');
        let rv: { [error: string]: any } = {};

        if (pwd1.value !== pwd2.value) {
            rv['passwordMismatch'] = true;
        }

        return rv;
    }

    ionViewDidLoad() {
        this.storage.get('user').then((user) => {
            this.user = user;
        });

        if (this.id) {
            this.apiProvider.builder('users/' + this.id).loader().get().subscribe((res) => {
                this.form.controls['name'].setValue(res.name);
                this.form.controls['email'].setValue(res.email);
                this.form.controls['cpf'].setValue(res.cpf);
                this.form.controls['role'].setValue(res.role);
            });
        }
    }

    /**
     * Submit function
     */
    submit() {
        if (this.navParams.get('id')) {
            this.apiProvider.builder('users/' + this.navParams.get('id')).loader().put(Object.assign({}, {id: this.id}, this.form.value)).subscribe((res) => this.redirect());
        } else {
            this.apiProvider.builder('users').loader().post(this.form.value).subscribe((res) => this.redirect());
        }
    }

    redirect() {
        this.navCtrl.push(UsersPage).then(() => {
            this.navCtrl.remove(this.navCtrl.getActive().index - 2, 2);
        });
    }
}
