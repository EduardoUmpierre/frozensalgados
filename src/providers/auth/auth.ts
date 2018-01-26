import { Injectable } from '@angular/core';
import { ApiProvider } from "../api/api";
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider extends ApiProvider {
    client = {
        client_id: '5',
        client_secret: '1a8RPbjkYzOTMImXYlcla4Ra7Q08sZvpikEs1ZNk',
        scope: ''
    };

    /**
     *
     * @returns {Promise<T | any[]>}
     */
    getUser() {
        return this.builder('auth/me').loader().get();
    }

    /**
     *
     * @param data
     * @returns {Promise<T | any[]>}
     */
    login(data) {
        console.log('login');

        data = this.buildAuthForm(data);
        data.grant_type = 'password';

        return this.http.post(this.urlBase + 'oauth/token', data).toPromise().then((res) => res.json());
    }

    /**
     *
     * @param data
     * @returns {Promise<T | any[]>}
     */
    refreshToken(data) {
        console.log('refresh');

        data = this.buildAuthForm(data);
        data.grant_type = 'refresh_token';

        let observable = this.http.post(this.urlBase + 'oauth/token', data);
        return this.toPromise(observable);
    }

    /**
     *
     * @param data
     * @returns {any}
     */
    private buildAuthForm(data) {
        data.client_id = this.client.client_id;
        data.client_secret = this.client.client_secret;
        data.scope = this.client.scope;

        return data;
    }
}
