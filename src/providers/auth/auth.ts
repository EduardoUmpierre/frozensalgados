import { Injectable } from '@angular/core';
import { ApiProvider } from "../api/api";
import { Http } from "@angular/http";
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
    private urlBase = '//localhost:8000';

    constructor(private ApiProvider: ApiProvider, public http: Http) {
        console.log('Hello AuthProvider Provider');
    }

    getUser() {
        return this.ApiProvider.builder('auth/me').get();
    }

    login(data) {
        return this.http.post(this.urlBase + '/oauth/token', data).toPromise().then((res) => res.json() || {});
    }

}
