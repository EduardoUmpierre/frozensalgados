import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiProvider } from "../api/api";

@Injectable()
export class SyncProvider {
    private categories = [];
    private syncedData = [];

    constructor(private storage: Storage, private apiProvider: ApiProvider) {
        this.storage.get('user').then((user) => {
            this.categories['customers'] = {'text': 'Clientes'};
            this.categories['orders'] = {'text': 'Pedidos'};
            this.categories['products'] = {'text': 'Produtos'};

            if (user.role == 1) {
                this.categories['users'] = {'text': 'Usuários'};
            }
        });
    }

    /**
     *
     */
    sync() {
        this.storage.get('sync').then(syncedData => {
            this.syncedData = syncedData || [];
            let categoriesToSync = [];
            
            for (let data in syncedData) {
                let timeSinceLastSync = new Date().getTime() - syncedData[data].date;

                if (timeSinceLastSync >= (3600 * 5 * 1000)) {
                    categoriesToSync.push(data);
                }
            }

            for (let data in this.categories) {
                if (!this.syncedData[data]) {
                    categoriesToSync.push(data);
                }
            }

            console.log(categoriesToSync);

            if (categoriesToSync.length > 0) {
                this.syncCategory(categoriesToSync);
            }
        });
    }

    /**
     *
     * @param {string[]} index
     */
    private syncCategory(index: string[]) {
        let key = index[0];
        let category = this.categories[key];
        index.splice(0, 1);

        this.updateSyncedData(key, category.text).subscribe(res => {
            this.syncedData[key] = [];
            this.syncedData[key]['date'] = new Date().getTime();
            this.syncedData[key]['items'] = res;

            if (index.length > 0) {
                this.syncCategory(index);
            } else {
                this.storage.set('sync', this.syncedData);
            }
        });
    }

    /**
     *
     * @param name
     * @param text
     * @returns {any}
     */
    private updateSyncedData(name, text) {
        return this.apiProvider.builder(name).loader('Baixando ' + text).get();
    }
}
