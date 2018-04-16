import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../api/api';
import { ToastController } from 'ionic-angular';

@Injectable()
export class SyncProvider {
    private categories = ['all_customers', 'customers', 'orders', 'products', 'users', 'categories'];
    private syncDelay = (3600 * 5 * 1000);

    constructor(private storage: Storage, private apiProvider: ApiProvider, private toastCtrl: ToastController) {
    }

    /**
     * Verifies all categories passed by parameter and sync them
     *
     * @param {string[]} categories
     * @param {boolean} force
     * @returns {Promise<any>}
     */
    syncCategories(categories: string[] = this.categories, force: boolean = false, toast: boolean = true): Promise<any> {
        return new Promise((resolve, reject) => {
            this.updateCategoriesData(categories, force, toast).then(() => resolve())
                .catch((error) => reject(error));
        });
    }

    /**
     * Verifies a single category and returns it if it exists otherwise sync and then return it
     *
     * @param {string} category
     * @param {boolean} force
     * @param {boolean} toast
     * @returns {Promise<any>}
     */
    verifySync(category: string, force: boolean = false, toast: boolean = true): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.get('sync_' + category).then(sync => {
                sync = sync || [];

                if (sync && this.isSyncTimeValid(sync['date']) && !force) {
                    resolve(sync['items']);
                } else {
                    let promise;

                    if (category == 'all_customers') {
                        promise = this.getCategoryData(category, toast, 'customers', {all: true});
                    } else {
                        promise = this.getCategoryData(category, toast);
                    }

                    promise.then((data) => resolve(data))
                        .catch((error) => reject(error));
                }
            }).catch((error) => reject(error));
        });
    }

    /**
     * Loops through the categories and verify if it's need to be updated
     *
     * @param {Array<any>} categories
     * @param {boolean} force
     * @param {boolean} toast
     * @returns {Promise<any>}
     */
    private updateCategoriesData(categories: Array<any>, force: boolean = false, toast: boolean = true): Promise<any> {
        let promiseChain: Promise<any> = Promise.resolve();
        categories = categories || [];

        categories.forEach((category, index) => {
            this.storage.get('sync_' + category).then(sync => {
                if ((sync && !this.isSyncTimeValid(sync['date'])) || !sync || force) {
                    if (index == 0 && toast) {
                        this.toast('Atualizando dados da aplicação');
                    }

                    promiseChain = promiseChain.then(() => {
                        if (category == 'all_customers') {
                            return this.getCategoryData(category, (categories.length - 1 == index) && toast, 'customers', {all: true});
                        }

                        return this.getCategoryData(category, (categories.length - 1 == index) && toast);
                    });
                }
            });
        });

        return promiseChain;
    }

    /**
     * Updates the category sync data
     *
     * @param category
     * @param {boolean} showToast
     * @param storageName
     * @param {object} params
     * @returns {Promise<any>}
     */
    private getCategoryData(category: any, showToast: boolean = true, storageName: any = category, params: object = null): Promise<any> {
        return this.apiProvider
            .builder(storageName)
            .get(params).toPromise().then((data) => {
                let syncData = {date: new Date().getTime(), items: data};

                this.storage.set('sync_' + category, syncData).then(() => {
                    if (showToast) {
                        this.toast();
                    }
                });

                return data;
            });
    }

    /**
     * Shows the toast
     *
     * @param {string} message
     * @param {number} duration
     */
    private toast(message: string = 'Dados atualizados com sucesso', duration: number = 3000) {
        this.toastCtrl.create({message: message, duration: duration}).present();
    }

    /**
     * Verifies if the sync time is valid or if it needs to be updated
     *
     * @param syncTime
     * @returns {Boolean}
     */
    private isSyncTimeValid(syncTime: any): Boolean {
        return new Date().getTime() - syncTime < this.syncDelay;
    }
}
