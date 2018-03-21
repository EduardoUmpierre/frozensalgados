import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../api/api';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';
import { ToastController } from "ionic-angular";

@Injectable()
export class SyncProvider {
    protected categories = ['customers', 'orders', 'products', 'users'];
    protected syncedData = [];
    protected syncDelay = (3600 * 5 * 1000);

    constructor(private storage: Storage, private apiProvider: ApiProvider, protected toastCtrl: ToastController) {

    }

    /**
     *
     * @param {string[]} categories
     * @returns {Promise<any>}
     */
    syncCategories(categories: string[] = this.categories): Promise<any> {
        return this.updateCategoriesData(categories)
    }

    /**
     *
     * @param {Array<any>} categories
     * @returns {Promise<any>}
     */
    private updateCategoriesData(categories: Array<any>): Promise<any> {
        let promiseChain: Promise<any> = Promise.resolve();
        categories = categories || [];

        categories.forEach(category => {
            promiseChain = promiseChain.then(() => this.getCategoryData(category));
        });

        this.toast('Dados atualizados com sucesso.');

        return promiseChain;
    }

    /**
     *
     * @param category
     * @returns {Promise<any>}
     */
    private getCategoryData(category: any): Promise<any> {
        return this.apiProvider.builder(category).get().toPromise().then((data) => {
            let syncData = {
                date: new Date().getTime(),
                items: data
            };

            this.storage.set('sync_' + category, syncData);
        });
    }

    /**
     * Shows the toast
     *
     * @param {string} message
     * @param {number} duration
     */
    private toast(message: string, duration: number = 3000) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });

        toast.present();
    }

    //
    //
    // /**
    //  *
    //  * @param {string[]} categories
    //  */
    // sync(categories: string[] = [], categoryToReturn: string = null) {
    //     return new Promise((resolve, reject) => {
    //         this.storage.get('sync').then((syncedData) => {
    //             this.syncedData = syncedData || [];
    //
    //             let categoriesToSync = [];
    //
    //             // Custom/single category sync
    //             if (categories.length > 0) {
    //                 categoriesToSync = categories;
    //             } else {
    //                 // Verify the last time the data was updated
    //                 // If it's old enough (syncDelay), adds to the categories to sync list
    //                 for (let data in syncedData) {
    //                     let timeSinceLastSync = new Date().getTime() - syncedData[data].date;
    //
    //                     if (timeSinceLastSync >= this.syncDelay) {
    //                         categoriesToSync.push(data);
    //                     }
    //                 }
    //
    //                 // Verify if the synced data is incomplete
    //                 for (let data in this.categories) {
    //                     if (!this.syncedData[data]) {
    //                         categoriesToSync.push(data);
    //                     }
    //
    //                     console.log(data);
    //                     console.log(this.categories);
    //                     console.log(categoriesToSync);
    //                 }
    //             }
    //
    //             if (categoriesToSync.length > 0) {
    //                 this.syncCategory(categoriesToSync).then((sync) => {
    //                     console.log('Synced data', sync);
    //
    //                     if (categoryToReturn) {
    //                         this.get(categoryToReturn).then((res) => {
    //                             resolve(res);
    //                         }).catch((error) => console.log(error));
    //                     } else {
    //                         this.set().then(() => {
    //                             resolve();
    //                         }).catch((error) => console.log(error));
    //                     }
    //                 }).catch((error) => {
    //                     reject();
    //                 });
    //             }
    //         });
    //     })
    // }
    //
    // /**
    //  *
    //  * @returns {Promise<any>}
    //  */
    // set() {
    //     console.log(this.syncedData);
    //
    //     let data = this.syncedData;
    //
    //     return new Promise((resolve, reject) => {
    //         this.storage.set('sync', data).then(() => resolve()).catch((error) => reject(error));
    //     });
    // }
    //
    // /**
    //  *
    //  * @param {string} category
    //  * @returns {Array}
    //  */
    // get(category: string = null) {
    //     return new Promise((resolve, reject) => {
    //         let data = this.syncedData;
    //
    //         console.log(data);
    //
    //         this.storage.set('sync', data).then(() => {
    //             resolve(data[category]);
    //         }).catch((error) => reject(error));
    //     });
    // }
    //
    // /**
    //  *
    //  * @param {string[]} categories
    //  */
    // private syncCategory(categories: string[]) {
    //     return new Promise((resolve, reject) => {
    //         let categoryName = categories[0];
    //         let category = this.categories[categoryName];
    //
    //         console.log('Sync b4 spl: ' + categories);
    //
    //         categories.splice(0, 1);
    //
    //         console.log('Sync aft spl: ' + categories);
    //
    //         this.updateSyncedData(categoryName, category.text).subscribe((res) => {
    //             console.log('updateSyncedData', res);
    //
    //             this.syncedData[categoryName] = {};
    //             this.syncedData[categoryName].date = new Date().getTime();
    //             this.syncedData[categoryName].items = res;
    //
    //             if (categories.length > 0) {
    //                 this.syncCategory(categories);
    //             } else {
    //                 console.log(this.syncedData);
    //
    //                 resolve(this.syncedData);
    //             }
    //         });
    //     });
    // }
    //
    // /**
    //  *
    //  * @param name
    //  * @param text
    //  * @returns {any}
    //  */
    // private updateSyncedData(name, text) {
    //     let message = 'Os dados de ' + text + ' foram atualizados com sucesso.';
    //
    //     return this.apiProvider.builder(name).toast(message).get();
    // }
}
