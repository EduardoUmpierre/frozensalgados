import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController, Platform } from "ionic-angular";
import { ApiProvider } from "../api/api";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { FileOpener } from "@ionic-native/file-opener";
import 'rxjs/Rx';
import { saveAs } from "file-saver";
import { ResponseContentType } from "@angular/http";

declare var cordova: any;

@Injectable()
export class DownloadProvider {
    private storageDirectory: string = '';

    constructor(private transfer: FileTransfer, private file: File, private platform: Platform,
                private apiProvider: ApiProvider, private androidPermissions: AndroidPermissions,
                private alertCtrl: AlertController, private fileOpener: FileOpener) {
        this.platform.ready().then(() => {
            // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
            if (!this.platform.is('cordova')) {
                this.apiProvider.hideLoader();
                return false;
            }

            if (this.platform.is('ios')) {
                this.storageDirectory = cordova.file.documentsDirectory;
            } else if (this.platform.is('android')) {
                this.storageDirectory = cordova.file.externalRootDirectory;
            } else {
                this.apiProvider.hideLoader();
                return false;
            }
        });
    }

    /**
     * Public method to download
     *
     * @param {string} url
     * @param {string} filename
     * @param {string} extension
     */
    public download(url: string, filename: string = 'file', extension: string = '.pdf') {
        if (this.apiProvider.isApp()) {
            // Verify if the platform is ready
            this.platform.ready().then(() => this.checkPermission(url, filename, extension));
        } else {
            // Download web
            this.apiProvider.loader('Baixando arquivo').builder(url).get({'stream': true}, ResponseContentType.Blob).subscribe(res => {
                let blob = new Blob([res.blob()], {type: 'application/pdf'});

                saveAs(blob, filename);
            });
        }
    };

    /**
     * Perfoms the download request
     *
     * @param {string} url
     * @param {string} filename
     * @param {string} extension
     */
    private sendDownloadRequest(url: string, filename: string, extension: string) {
        const fileTransfer: FileTransferObject = this.transfer.create();

        this.apiProvider.loader('Baixando arquivo').getApiToken().subscribe(res => {
            const apiUrl = this.apiProvider.urlBase + 'api/v1/' + url;
            const localFile = this.storageDirectory + 'Download/' + filename + extension;
            const options = {
                headers: {
                    'Authorization': 'Bearer ' + res
                }
            };

            // Downloads the file
            fileTransfer.download(apiUrl, localFile, true, options).then((entry) => {
                this.apiProvider.hideLoader();

                let alert = this.alertCtrl.create({
                    title: 'Sucesso',
                    message: 'Arquivo baixado com sucesso',
                    buttons: [
                        {
                            text: 'Fechar',
                            role: 'cancel'
                        },
                        {
                            text: 'Abrir',
                            handler: () => {
                                this.openFile(entry.toURL());
                            }
                        }
                    ]
                });

                alert.present();
            }, (error) => {
                console.log(error);
                this.apiProvider.hideLoader();

                let alert = this.alertCtrl.create({
                    title: 'Tente novamente',
                    message: 'Ocorreu um erro ao baixar o arquivo',
                    buttons: ['Fechar']
                });

                alert.present();
            });
        });
    }

    /**
     * @param {string} url
     * @param {string} filename
     * @param {string} extension
     */
    private checkPermission(url: string, filename: string, extension: string) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then(
                result => {
                    if (result.hasPermission) {
                        this.sendDownloadRequest(url, filename, extension);
                    } else {
                        this.requestPermission(url, filename, extension);
                    }
                },
                err => {
                    this.requestPermission(url, filename, extension);
                }
            );
    }

    /**
     * @param {string} url
     * @param {string} filename
     * @param {string} extension
     */
    private requestPermission(url: string, filename: string, extension: string) {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then(status => {
                this.sendDownloadRequest(url, filename, extension);
            })
    }

    /**
     * @param {string} path
     * @param {string} type
     */
    private openFile(path: string, type: string = 'application/pdf') {
        this.fileOpener.open(path, type)
            .then(() => console.log('File is opened'))
            .catch(e => {
                let alert = this.alertCtrl.create({
                    title: 'Tente novamente',
                    message: 'Ocorreu um erro ao abrir o arquivo',
                    buttons: ['Fechar']
                });

                alert.present();
            });
    }
}
