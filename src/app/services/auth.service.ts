import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import UserService from '@services/user.service';

@Injectable()
export default class AuthService {
  private user: UserService = inject(UserService);

  public isAuthenticated(): boolean {
    this.user.loadLogin();
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(this.user.token);
  }
}
