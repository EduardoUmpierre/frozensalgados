import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HttpAngularProvider } from './http-angular';
import { HttpNativeProvider } from './http-native';

@Injectable()
export class HttpProvider {
    public http;

    constructor(private platform: Platform, private angularHttp: HttpAngularProvider,
                private nativeHttp: HttpNativeProvider) {
        this.platform.ready().then(() => {
            let isApp = this.isApp();

            console.log(this.platform.platforms());
            console.log('IS APP?', isApp);

            this.http = isApp ? this.nativeHttp : this.angularHttp;
        });
    }

    /**
     * Verify if the platform is an app
     *
     * @returns {boolean}
     */
    public isApp() {
        return this.platform.is('cordova');
    }
}