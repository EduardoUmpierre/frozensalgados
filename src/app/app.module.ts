import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { CustomersPage } from '../pages/customers/index/customers';
import { CustomerFormPage } from '../pages/customers/form/customer-form';
import { CustomerViewPage } from '../pages/customers/view/customer-view'
import { OrdersPage } from '../pages/orders/index/orders';
import { ProductsPage } from '../pages/products/index/products';
import { OrderViewPage } from '../pages/orders/view/order-view'
import { OrderFormPage } from '../pages/orders/form/order-form'
import { OrderProductModalPage } from '../pages/orders/modal/order-product-modal'
import { ListFormPage } from '../pages/list-form/list-form'
import { LoginFormPage } from '../pages/login-form/login-form'
import { UserPage } from '../pages/users/user/user'
import { UsersPage } from '../pages/users/index/users'
import { UserFormPage } from '../pages/users/form/user-form'

import { SelectSearchableModule } from '../components/select/select-module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { ApiProvider } from '../providers/api/api';
import { ExternalProvider } from '../providers/api/external';
import { AuthProvider } from '../providers/auth/auth';
import { ProductFormPage } from "../pages/products/form/product-form";

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        CustomersPage,
        CustomerFormPage,
        OrdersPage,
        ProductsPage,
        ProductFormPage,
        OrderViewPage,
        OrderFormPage,
        OrderProductModalPage,
        ListFormPage,
        CustomerViewPage,
        LoginFormPage,
        UserPage,
        UsersPage,
        UserFormPage
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
        CustomerFormPage,
        OrdersPage,
        ProductsPage,
        ProductFormPage,
        OrderViewPage,
        OrderFormPage,
        OrderProductModalPage,
        ListFormPage,
        CustomerViewPage,
        LoginFormPage,
        UserPage,
        UsersPage,
        UserFormPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiProvider,
        ExternalProvider,
        AuthProvider
    ]
})
export class AppModule {
}
