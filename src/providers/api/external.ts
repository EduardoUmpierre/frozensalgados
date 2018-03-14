import { Injectable } from '@angular/core';
import { ApiProvider } from "./api";

@Injectable()
export class ExternalProvider extends ApiProvider {
    /**
     * HTTP GET request
     *
     * @param {string} url
     * @returns {any}
     */
    get(url: string) {
        return this.toPromise(this.httpProvider.http.get(url));
    }
}