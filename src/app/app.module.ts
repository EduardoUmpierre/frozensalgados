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
import { LoginFormPage } from '../pages/login-form/login-form'

import { SelectSearchableModule } from '../components/select/select-module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';

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
        CustomerViewPage,
        LoginFormPage,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        SelectSearchableModule,
        IonicStorageModule.forRoot({
            name: '__mydb',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
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
        CustomerViewPage,
        LoginFormPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiProvider,
        AuthProvider
    ]
})
export class AppModule {
}
