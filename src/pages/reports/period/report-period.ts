import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ReportsViewPage } from "../view/reports-view";

/**
 * Generated class for the ReportPeriodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-report-period',
    templateUrl: 'report-period.html',
})
export class ReportPeriodPage {
    private report;
    private currentPeriod;
    private currentPeriodText;

    /**
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {ApiProvider} apiProvider
     */
    constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider) {
        this.updateCurrentPeriod(moment().format());
    }

    /**
     * @param {string} period
     */
    updateCurrentPeriod(period: any) {
        period = moment(period);

        this.currentPeriod = period;
        this.currentPeriodText = period.format('MMMM/YYYY');

        this.getMonthReport();
    }

    /**
     *
     */
    goToNextMonth() {
        this.updateCurrentPeriod(this.currentPeriod.add(1, 'month'));
    }

    /**
     *
     */
    goToPreviousMonth() {
        this.updateCurrentPeriod(this.currentPeriod.subtract(1, 'month'));
    }

    /**
     *
     */
    getMonthReport() {
        let start = moment(this.currentPeriod).startOf('month').format('YYYY-MM-DD');
        let end = moment(this.currentPeriod).endOf('month').format('YYYY-MM-DD');

        this.apiProvider.builder('reports/period/' + start + '/' + end).loader().get()
            .subscribe((res) => this.report = res);
    }

    /**
     * @param {string} category
     */
    goToReport(category: string) {
        let start = moment(this.currentPeriod).startOf('month').format('YYYY-MM-DD');
        let end = moment(this.currentPeriod).endOf('month').format('YYYY-MM-DD');

        this.navCtrl.push(ReportsViewPage, {'category': category, 'period': [start, end]});
    }
}
