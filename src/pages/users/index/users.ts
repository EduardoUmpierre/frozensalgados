import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { ApiProvider } from "../../../providers/api/api";
import { UserFormPage } from "../form/user-form";
import { SyncProvider } from "../../../providers/sync/sync";

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

    constructor(private navCtrl: NavController, private apiProvider: ApiProvider, private storage: Storage,
                private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,
                private syncProvider: SyncProvider) {
    }

    /**
     *
     */
    ionViewWillEnter() {
        this.syncProvider
            .verifySync('users')
            .then(users => this.users = users)
            .then(() => this.loaded = true)
            .catch((error) => console.log(error));
    }

    /**
     *
     */
    ionViewCanEnter() {
        this.storage.get('user').then((user) => {
            this.user = user;

            if (this.user.role != 1) {
                this.navCtrl.pop();
            }
        });
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
        this.syncProvider.verifySync('users', true).then(() => {
            this.users.splice(key, 1);
        }).catch(error => console.log(error));
    }
}
