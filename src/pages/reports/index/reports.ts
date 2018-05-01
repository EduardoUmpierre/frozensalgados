import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportsViewPage } from "../view/reports-view";
import { ReportPeriodPage } from "../period/report-period";

/**
 * Generated class for the ReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-reports',
    templateUrl: 'reports.html',
})
export class ReportsPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    /**
     * @param {string} category
     */
    goToReportView(category: string) {
        this.navCtrl.push(ReportsViewPage, {'category': category});
    }

    goToReportPeriod() {
        this.navCtrl.push(ReportPeriodPage);
    }
}
