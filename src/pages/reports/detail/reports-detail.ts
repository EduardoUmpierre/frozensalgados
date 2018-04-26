import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../../providers/api/api";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
        this.id = this.navParams.get('id');
        this.category = this.navParams.get('category');
    }

    /**
     *
     */
    ionViewWillEnter() {
        console.log('will enter');

        this.apiProvider.builder('reports/' + this.category + '/' + this.id).loader().get()
            .subscribe((res) => this.report = res);
    }
}
