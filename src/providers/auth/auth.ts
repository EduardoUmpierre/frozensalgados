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
export class AuthProvider extends ApiProvider {
    getUser(token) {
        return this.builder('auth/me', token).loader().get()
            .then((res) => res);
    }

    login(data) {
        return this.http.post(this.urlBase + 'oauth/token', data).toPromise()
            .then((res) => res.json() || {});
    }
}
