import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.

  @todo Adicionar sistema de verificação de ambiente para modificar a URL da api
*/
@Injectable()
export class ApiProvider {
    private url: string;
    private urlBase = 'https://frozensalgados.herokuapp.com/api/v1/';
    private urlParams = '';

    constructor(public http: Http) {
        console.log('Hello ApiProvider Provider');
    }

    builder(type: string, params: string) {
        this.url = this.urlBase + type;

        if (params)
            this.url += '?' + params;

        this.url += this.urlParams;

        return this;
    }

    getApiData() {
        return this.http.get(this.url)
            .toPromise()
            .then((api) => {
                return api.json() || {}
            });
    }
}
