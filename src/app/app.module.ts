import { Pro } from '@ionic/pro';
import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
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

import { HttpProvider } from "../providers/api/http/http"
import { HttpAngularProvider } from "../providers/api/http/http-angular"
import { HttpNativeProvider } from "../providers/api/http/http-native"

Pro.init('74f2ff88', {
    appVersion: '0.0.1'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
    ionicErrorHandler: IonicErrorHandler;

    constructor(injector: Injector) {
        try {
            this.ionicErrorHandler = injector.get(IonicErrorHandler);
        } catch(e) {
            // Unable to get the IonicErrorHandler provider, ensure
            // IonicErrorHandler has been added to the providers list below
        }
    }

    handleError(err: any): void {
        Pro.monitoring.handleNewError(err);
        // Remove this if you want to disable Ionic's auto exception handling
        // in development mode.
        this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
    }
}

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
        ApiProvider,
        ExternalProvider,
        AuthProvider,
        HttpProvider,
        HttpAngularProvider,
        HttpNativeProvider,
        HTTP,
        IonicErrorHandler,
        Pro,
        [{ provide: ErrorHandler, useClass: MyErrorHandler }]
    ]
})
export class AppModule {
}
