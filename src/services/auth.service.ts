import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { JwtHelper } from 'angular2-jwt';

import { StorageService } from './storage.service';
import { LocalUser } from './../models/localuser';
import { API_CONFIG } from './../config/api.config';
import { CredenciaisDTO } from './../models/credenciais.dto';

@Injectable()
export class AuthService {
  // Instância do Objeto para manipulação dos Tokens JWT
  jwtHelper: JwtHelper = new JwtHelper();


  constructor(public http: HttpClient, public storage: StorageService) {

  }

  authenticate(creds: CredenciaisDTO) {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: 'response',
      responseType: 'text'
    })
  }

  successfulLogin(authorizationValue : string) {
    let tok = authorizationValue.substring(7);
    let user : LocalUser = {
        token: tok,
        email: this.jwtHelper.decodeToken(tok).sub
    };
    this.storage.setLocalUser(user);
  }

  logout() {
    this.storage.setLocalUser(null);
  }

}