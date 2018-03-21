import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { ApiProvider } from "../../../providers/api/api";
import { UserFormPage } from "../form/user-form";

/**
 * Generated class for the SellersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-users',
    templateUrl: 'users.html',
})
export class UsersPage {
    user: any = {};
    users = [];
    loaded: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, public storage: Storage, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        this.storage.get('user').then((user) => {
            this.user = user;

            this.storage.get('sync').then(sync => {
                if (sync['users']) {
                    this.users = sync['users']['items'];
                } else {
                    this.apiProvider.builder('users').loader().get().subscribe((res) => {
                        this.users = res;
                    });
                }

                this.loaded = true;
            });
        });
    }

    ionViewCanEnter() {
        if (this.user.role != 1) {
            this.navCtrl.pop();
        }
    }

    /**
     * Push to user form page
     *
     * @param {number} id
     */
    goToForm(id: number = null) {
        this.navCtrl.push(UserFormPage, {id: id});
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
                            message: 'Deseja remover este usuário?',
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel'
                                },
                                {
                                    text: 'Remover',
                                    handler: () => {
                                        this.apiProvider.builder('users/' + id).loader().delete().subscribe((res) => this.remove(key));
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
        if (this.users[key]) {
            this.users.splice(key, 1);
        }
    }
}
