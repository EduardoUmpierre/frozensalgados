import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';

import { LoginFormPage } from '../pages/login-form/login-form';
import { HomePage } from '../pages/home/home';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage,
                keyboard: Keyboard) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            storage.get('token')
                .then((res) => {
                    if (res && res != null) {
                        this.rootPage = HomePage;
                    } else {
                        this.rootPage = LoginFormPage;
                    }
                });

            keyboard.disableScroll(false);
            statusBar.styleBlackOpaque();
            splashScreen.hide();
        });
    }
}
