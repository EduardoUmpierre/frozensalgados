import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import { ReportsDetailPage } from "../detail/reports-detail";
import { ReportPopoverComponent } from "../../../components/report-popover/report-popover";
import * as moment from 'moment';
import 'moment/locale/pt-br';

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
    private pageTitle;
    private period;
    private periodTitle;
    private loaded;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider,
                public popoverCtrl: PopoverController) {
        this.category = this.navParams.get('category');

        let categoryName;

        switch (this.category) {
            case 'categories':
                categoryName = 'categorias';
                break;
            case 'sellers':
                categoryName = 'vendedores';
                break;
            case 'products':
                categoryName = 'produtos';
                break;
        }

        this.pageTitle = 'Relatório de ' + categoryName;

        this.updatePeriod(this.navParams.get('period'));
    }

    /**
     *
     * @param {number} id
     */
    goToDetails(id: number) {
        this.navCtrl.push(ReportsDetailPage, {'id': id, 'category': this.category, 'period': this.period});
    }

    /**
     *
     * @param myEvent
     */
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(ReportPopoverComponent, {period: this.period});
        popover.present();
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
            this.period = [period[0], period[1]];
            this.periodTitle = moment(period[0]).format('DD/MM/YYYY') + ' - ' + moment(period[1]).format('DD/MM/YYYY');

            this.apiProvider.builder('reports/' + this.category + '/' + period[0] + '/' + period[1]).loader().get()
                .subscribe((res) => {
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
}
