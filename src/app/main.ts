import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HTTP } from '@ionic-native/http';
HTTP.getPluginRef = () => "cordova.plugin.http";

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
