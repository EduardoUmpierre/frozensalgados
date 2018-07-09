import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Platform } from "ionic-angular";
import { ApiProvider } from "../api/api";

declare var cordova: any;

@Injectable()
export class DownloadProvider {
    private storageDirectory: string = '';

    constructor(private transfer: FileTransfer, private file: File, private platform: Platform,
                private apiProvider: ApiProvider) {
        this.platform.ready().then(() => {
            // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
            if (!this.platform.is('cordova')) {
                this.apiProvider.hideLoader();
                return false;
            }

            if (this.platform.is('ios')) {
                this.storageDirectory = cordova.file.documentsDirectory;
            }
            else if (this.platform.is('android')) {
                this.storageDirectory = cordova.file.dataDirectory;
            }
            else {
                this.apiProvider.hideLoader();
                // exit otherwise, but you could add further types here e.g. Windows
                return false;
            }
        });
    }

    public download(url: string) {
        if (this.apiProvider.isApp()) {
            this.platform.ready().then(() => {
                const fileTransfer: FileTransferObject = this.transfer.create();

                this.apiProvider.loader('Baixando arquivo');

                console.log(url);

                this.apiProvider.getApiToken().subscribe(res => {
                    console.log(res);

                    fileTransfer.download(this.apiProvider.urlBase + 'api/v1/' + url, this.storageDirectory + 'file.pdf', true, {
                        'Authorization': 'Bearer ' + res
                    }).then((entry) => {
                        console.log('download complete: ' + entry.toURL());
                        this.apiProvider.hideLoader();
                    }, (error) => {
                        console.log(error);
                        this.apiProvider.hideLoader();
                    });
                });
            });
        } else {
            
        }
    };
}
