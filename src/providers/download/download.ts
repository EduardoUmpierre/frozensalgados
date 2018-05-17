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
        this.platform.ready().then(() => {
            const fileTransfer: FileTransferObject = this.transfer.create();

            this.apiProvider.loader('Baixando arquivo');

            this.apiProvider.getApiToken().subscribe(res => {
                let options = {
                    headers: {
                        'Authorization': 'Bearer ' + res
                    }
                };

                console.log(options);

                fileTransfer.download(this.apiProvider.urlBase + 'api/v1/' + url, this.storageDirectory + 'file.pdf', true, options).then((entry) => {
                    console.log('download complete: ' + entry.toURL());
                    this.apiProvider.hideLoader();
                }, (error) => {
                    this.apiProvider.hideLoader();
                    console.log(error);
                });
            });
        });
    }
}
