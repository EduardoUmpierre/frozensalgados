import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthProvider extends ApiProvider {
    client = {
        client_id: '5',
        client_secret: '1a8RPbjkYzOTMImXYlcla4Ra7Q08sZvpikEs1ZNk',
        scope: ''
    };

    /**
     * Get current user data
     *
     * @returns {any}
     */
    getUser() {
        return this.builder('auth/me').loader().get();
    }

    /**
     * Do the login request
     *
     * @param data
     */
    login(data) {
        data = this.buildAuthForm(data);
        data.grant_type = 'password';

        return this.httpProvider.http.post(this.urlBase + 'oauth/token', data).toPromise().then(res => res);
    }

    /**
     * Refresh the authorization token
     *
     * @param data
     * @returns {any}
     */
    refreshToken(data) {
        data = this.buildAuthForm(data);
        data.grant_type = 'refresh_token';

        let observable = this.httpProvider.http.post(this.urlBase + 'oauth/token', data);
        return this.toPromise(observable);
    }

    /**
     * Builds the authorization form
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
