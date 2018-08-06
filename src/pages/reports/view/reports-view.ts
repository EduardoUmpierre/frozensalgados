import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import { ReportsDetailPage } from "../detail/reports-detail";
import { ReportPopoverComponent } from "../../../components/report-popover/report-popover";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { DownloadProvider } from "../../../providers/download/download";

/**
 * Generated class for the ReportsViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-reports-view',
    templateUrl: 'reports-view.html',
})
export class ReportsViewPage {
    private reports;
    private category;
    private categoryName;
    private pageTitle;
    private period;
    private periodTitle;
    private loaded;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider,
                public popoverCtrl: PopoverController, private downloadProvider: DownloadProvider) {
        this.category = this.navParams.get('category');

        switch (this.category) {
            case 'categories':
                this.categoryName = 'categorias';
                break;
            case 'sellers':
                this.categoryName = 'vendedores';
                break;
            case 'products':
                this.categoryName = 'produtos';
                break;
            case 'customers':
                this.categoryName = 'clientes';
                break;
            case 'orders':
                this.categoryName = 'pedidos';
                break;
        }

        this.pageTitle = 'Relatório de ' + this.categoryName;

        this.updatePeriod(this.navParams.get('period'));
    }

    /**
     * @param {number} id
     */
    goToDetails(id: number) {
        this.navCtrl.push(ReportsDetailPage, {'id': id, 'category': this.category, 'period': this.period});
    }

    /**
     * @param myEvent
     */
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(ReportPopoverComponent, {period: this.period});
        popover.present({ev: myEvent});
        popover.onDidDismiss(data => {
            if (data) {
                this.updatePeriod([data.from, data.to]);
            }
        });
    }

    /**
     * @param period
     */
    updatePeriod(period) {
        if (period && period[0] && period[1]) {
            this.period = period = [
                period[0],
                period[1]
            ];

            this.periodTitle = moment(period[0]).format('DD/MM/YYYY') + ' - ' + moment(period[1]).format('DD/MM/YYYY');

            this.apiProvider
                .builder('reports/' + this.category + '/' + moment(period[0]).format('YYYY-MM-DD') + '/' + moment(period[1]).format('YYYY-MM-DD'))
                .loader().get().subscribe((res) => {
                this.reports = res;
                this.loaded = true;
            });
        } else {
            this.period = [];
            this.periodTitle = 'Sempre';

            this.apiProvider.builder('reports/' + this.category).loader().get()
                .subscribe((res) => {
                    this.reports = res;
                    this.loaded = true;
                });
        }
    }

    /**
     * Calls the download method
     */
    download() {
        let url = 'reports/' + this.category + '/download';
        let filename = 'relatorio-' + this.categoryName;

        if (this.period && this.period[0] && this.period[1]) {
            const from = moment(this.period[0]);
            const to = moment(this.period[1]);

            url += '/' + from.format('YYYY-MM-DD') + '/' + to.format('YYYY-MM-DD');
            filename += '-' + from.format('DD-MM-YYYY') + '-' + to.format('DD-MM-YYYY');
        }

        this.downloadProvider.download(url, filename);
    }
}
