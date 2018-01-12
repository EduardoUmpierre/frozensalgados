import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { CustomersPage } from '../pages/customers/customers';
import { OrdersPage } from '../pages/orders/orders';
import { ProductsPage } from '../pages/products/products';
import { OrderViewPage } from '../pages/order-view/order-view'
import { OrderFormPage } from '../pages/order-form/order-form'
import { OrderProductModalPage } from '../pages/order-product-modal/order-product-modal'
import { ListFormPage } from '../pages/list-form/list-form'
import { CustomerViewPage } from '../pages/customer-view/customer-view'

import { SelectSearchableModule } from '../components/select/select-module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        CustomersPage,
        OrdersPage,
        ProductsPage,
        OrderViewPage,
        OrderFormPage,
        OrderProductModalPage,
        ListFormPage,
        CustomerViewPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        SelectSearchableModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        CustomersPage,
        OrdersPage,
        ProductsPage,
        OrderViewPage,
        OrderFormPage,
        OrderProductModalPage,
        ListFormPage,
        CustomerViewPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiProvider
    ]
})
export class AppModule {
}
