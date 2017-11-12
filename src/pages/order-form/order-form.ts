import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectSearchable } from '../../components/select/select';
import { ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the OrderFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

class Port {
    public id: number;
    public name: string;
    public country: string;
}

@IonicPage()
@Component({
    selector: 'page-order-form',
    templateUrl: 'order-form.html',
})
export class OrderFormPage {

    ports: Port[];
    port: Port;

    constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider) {
        this.ports = [
            { id: 0, name: 'Tokai', country: 'Japan' },
            { id: 1, name: 'Vladivostok', country: 'Russia' },
            { id: 2, name: 'Navlakhi', country: 'India' }
        ];
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderFormPage');
    }

    searchPorts(event: { component: SelectSearchable, text: string }) {
        let portName = event.text || '';
        // Show loader while loading data from the server.
        event.component.isSearching = true;

        // Use some service to get data from the server and stop the loader when finish.
        this.apiProvider.builder('customers', 'name=' + portName).get().then((customers) => {
            event.component.items = customers;
            event.component.isSearching = false;
        });
    }

    portChange(event: { component: SelectSearchable, value: any }) {
        console.log('value:', event.value);
    }

}
