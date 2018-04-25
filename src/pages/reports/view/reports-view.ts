import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
        this.category = this.navParams.get('category');
    }

    ionViewDidLoad() {
        this.apiProvider.builder('reports/' + this.category).loader().get()
            .subscribe((res) => this.reports = res);
    }
}
