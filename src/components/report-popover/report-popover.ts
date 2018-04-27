import { Component } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";
import * as moment from 'moment';
import 'moment/locale/pt-br';

/**
 * Generated class for the ReportPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'report-popover',
    templateUrl: 'report-popover.html'
})
export class ReportPopoverComponent {
    private from;
    private to;

    constructor(public viewCtrl: ViewController, public navParams: NavParams) {
        let period = this.navParams.get('period');

        moment.locale('pt-BR');

        if (Array.isArray(period) && period.length > 0) {
            this.from = moment(period[0]).format();
            this.to = moment(period[1]).format();
        } else {
            this.to = moment().format();
        }
    }

    save() {
        this.viewCtrl.dismiss({from: this.from, to: this.to});
    }

    clear() {
        this.to = moment().format();
        this.from = null;
    }
}
