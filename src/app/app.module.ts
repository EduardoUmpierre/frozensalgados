import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Keyboard } from '@ionic-native/keyboard';
import { MyApp } from './app.component';

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

import { Pro } from "@ionic/pro";
import { NgModule, ErrorHandler, Injectable, Injector, LOCALE_ID } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { SyncProvider } from '../providers/sync/sync';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { CurrencyPipe, DecimalPipe, registerLocaleData } from "@angular/common";

import localePt from '@angular/common/locales/pt';
import { CategoryFormPage } from "../pages/categories/form/category-form";
import { ReportsPage } from "../pages/reports/index/reports";
import { ReportsViewPage } from "../pages/reports/view/reports-view";
import { ReportsDetailPage } from "../pages/reports/detail/reports-detail";
import { ReportPopoverComponent } from "../components/report-popover/report-popover";
import { ReportPeriodPage } from "../pages/reports/period/report-period";
import { DownloadProvider } from '../providers/download/download';
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";

registerLocaleData(localePt);

Pro.init('74f2ff88', {
    appVersion: '1.2.0'
});

@Injectable()
export class MyErrorHandler implements ErrorHandler {
    ionicErrorHandler: IonicErrorHandler;

    constructor(injector: Injector) {
        try {
            this.ionicErrorHandler = injector.get(IonicErrorHandler);
        } catch (e) {
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
        HomePage,
        CustomersPage,
        CustomerFormPage,
        OrdersPage,
        ProductsPage,
        ProductFormPage,
        CategoryFormPage,
        OrderViewPage,
        OrderFormPage,
        OrderProductModalPage,
        ListFormPage,
        CustomerViewPage,
        LoginFormPage,
        UserPage,
        UsersPage,
        UserFormPage,
        ReportsPage,
        ReportsViewPage,
        ReportsDetailPage,
        ReportPopoverComponent,
        ReportPeriodPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp, {
            scrollPadding: false,
            scrollAssist: true,
            autoFocusAssist: true,
            monthNames: [
                'Janeiro', 'Fevereiro', 'Mar\u00e7o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
                'Outubro', 'Novembro', 'Dezembro'
            ],
            monthShortNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            dayNames: [
                'Domingo', 'Segunda-feira', 'Ter\u00e7a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
            ],
            dayShortNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        }),
        SelectSearchableModule,
        BrMaskerModule,
        IonicStorageModule.forRoot({
            name: '__mydb',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        CustomersPage,
        CustomerFormPage,
        OrdersPage,
        ProductsPage,
        ProductFormPage,
        CategoryFormPage,
        OrderViewPage,
        OrderFormPage,
        OrderProductModalPage,
        ListFormPage,
        CustomerViewPage,
        LoginFormPage,
        UserPage,
        UsersPage,
        UserFormPage,
        ReportsPage,
        ReportsViewPage,
        ReportsDetailPage,
        ReportPopoverComponent,
        ReportPeriodPage
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
        DownloadProvider,
        FileTransfer,
        File,
        Keyboard,
        IonicErrorHandler,
        SyncProvider,
        CurrencyPipe,
        DecimalPipe,
        {provide: LOCALE_ID, useValue: "pt-BR"},
        [{provide: ErrorHandler, useClass: MyErrorHandler}],
    DownloadProvider,
    ]
})
export class AppModule {
}
