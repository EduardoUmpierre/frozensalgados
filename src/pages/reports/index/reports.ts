import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportsViewPage } from "../view/reports-view";

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
     * @param category
     */
    goToReportView(category) {
        this.navCtrl.push(ReportsViewPage, {'category': category});
    }
}
