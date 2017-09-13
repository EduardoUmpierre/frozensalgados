import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CustomersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-customers',
    templateUrl: 'customers.html',
})
export class CustomersPage {

    public customers = [
        {
            "id": "59b409c7f2d3ed4b865d89d6",
            "name": "Cornelia Deleon",
            "phone": "(803) 479-2733",
            "address": "Apollo Street, 315",
            "city": "Spelter",
            "district": "Tennessee",
            "cep": 1967,
            "toggle": false
        },
        {
            "id": "59b409c78dc482f676c13862",
            "name": "Humphrey Tanner",
            "phone": "(883) 504-2308",
            "address": "Lacon Court, 299",
            "city": "Baker",
            "district": "Virgin Islands",
            "cep": 5310,
            "toggle": false
        },
        {
            "id": "59b409c7c31be7016453e0f3",
            "name": "Allyson Cortez",
            "phone": "(987) 453-2202",
            "address": "Bills Place, 137",
            "city": "Smock",
            "district": "West Virginia",
            "cep": 3127,
            "toggle": false
        },
        {
            "id": "59b409c7ad53bfb37d6229d3",
            "name": "Sherri Neal",
            "phone": "(917) 426-2810",
            "address": "Garden Place, 592",
            "city": "Sedley",
            "district": "South Dakota",
            "cep": 4264,
            "toggle": false
        },
        {
            "id": "59b409c77d402ec986a8eb2b",
            "name": "Oneill Langley",
            "phone": "(933) 493-2084",
            "address": "Sumner Place, 797",
            "city": "Tetherow",
            "district": "New York",
            "cep": 7713,
            "toggle": false
        },
        {
            "id": "59b409c74f65cf0e2355eaaa",
            "name": "May Sargent",
            "phone": "(829) 468-2425",
            "address": "Midwood Street, 510",
            "city": "Islandia",
            "district": "Vermont",
            "cep": 310,
            "toggle": false
        },
        {
            "id": "59b409c77e7bb1abb71a7086",
            "name": "Clara Holloway",
            "phone": "(925) 538-2213",
            "address": "Court Street, 248",
            "city": "Helen",
            "district": "Washington",
            "cep": 6079,
            "toggle": false
        }
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CustomersPage');
    }

    toggleCard(index: number) {
        this.customers[index]["toggle"] = !this.customers[index]["toggle"];
    }
}
