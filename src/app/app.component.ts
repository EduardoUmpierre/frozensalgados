import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginFormPage } from '../pages/login-form/login-form';
import { HomePage } from '../pages/home/home';
import { AuthProvider } from "../providers/auth/auth";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = LoginFormPage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage, authProvider: AuthProvider) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            storage.get('token')
                .then((res) => {
                    console.log('res token', res);

                    if (res && res != null) {
                        this.rootPage = HomePage;
                    }
                });

            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
}
