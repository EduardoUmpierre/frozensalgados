import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HttpAngularProvider } from './http-angular';
import { HttpNativeProvider } from './http-native';

@Injectable()
export class HttpProvider {
    public http;

    constructor(private platform: Platform, private angularHttp: HttpAngularProvider, private nativeHttp: HttpNativeProvider) {
        this.platform.ready().then(() => {
            let isApp = this.platform.is('core') || this.platform.is('cordova');

            console.log(this.platform.platforms());
            console.log('IS APP?');
            console.info(isApp);

            this.http = isApp ? nativeHttp : angularHttp;
        });
    }
}