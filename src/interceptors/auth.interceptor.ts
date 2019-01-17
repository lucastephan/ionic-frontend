import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

import { StorageService } from './../services/storage.service';
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let localUser = this.storage.getLocalUser();

    let urlLength = API_CONFIG.baseUrl.length;
    let requestToAPI = req.url.substring(0, urlLength) == API_CONFIG.baseUrl; // Verifica se a URL da requisição bate com a BaseUrl da API (usado para enviar o cabeçalho somente para reqs para a API)

    if (localUser && requestToAPI) {
      const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)}); // Método que clona a requisição e envia no cabeçalho o token dentro da "tag" 'Authorization'
      return next.handle(authReq);
    } else {
      return next.handle(req) // Caso não haja usuário no localUser, a requisição original será propagada normalmente, sem o token no cabeçalho
    }
  }

}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}
