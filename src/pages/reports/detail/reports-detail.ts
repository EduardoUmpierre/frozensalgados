import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ReportPopoverComponent } from "../../../components/report-popover/report-popover";

/**
 * Generated class for the ReportsDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-reports-detail',
    templateUrl: 'reports-detail.html',
})
export class ReportsDetailPage {
    private id;
    private category;
    private report;
    private pageTitle;
    private listTitle;
    private period;
    private periodTitle;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider,
                public popoverCtrl: PopoverController) {
        moment.locale('pt-BR');

        this.id = this.navParams.get('id');
        this.category = this.navParams.get('category');

        let categoryName;

        switch (this.category) {
            case 'categories':
                categoryName = 'categoria';
                this.listTitle = 'Lista de produtos';
                break;
            case 'sellers':
                categoryName = 'vendedor';
                this.listTitle = 'Lista de pedidos';
                break;
            case 'products':
                categoryName = 'produto';
                this.listTitle = 'Lista de pedidos';
                break;
            case 'customers':
                categoryName = 'cliente';
                this.listTitle = 'Lista de pedidos';
                break;
            case 'orders':
                categoryName = 'pedido';
                this.listTitle = 'Lista de produtos';
                break;
            default:
                this.listTitle = 'Listagem';
        }

        this.pageTitle = 'Relatório de ' + categoryName;

        this.updatePeriod(this.navParams.get('period'));
    }

    /**
     *
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

            this.apiProvider.builder('reports/' + this.category + '/' + this.id + '/' + moment(period[0]).format('YYYY-MM-DD') + '/' + moment(period[1]).format('YYYY-MM-DD'))
                .loader().get().subscribe((res) => this.updateListDate(res));
        } else {
            this.period = [];
            this.periodTitle = 'Sempre';

            this.apiProvider.builder('reports/' + this.category + '/' + this.id).loader().get()
                .subscribe((res) => this.updateListDate(res));
        }
    }

    /**
     *
     * @param res
     */
    updateListDate(res) {
        if (res.list && res.list.length > 0) {
            res.list.forEach((e, i) => {
                if (e.created_at) {
                    res.list[i].created_at = moment(e.created_at).format('DD/MM/YYYY HH:mm:ss')
                }
            });
        }

        this.report = res;
    }
}
