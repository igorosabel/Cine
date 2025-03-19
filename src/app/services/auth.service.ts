import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import UserService from '@services/user.service';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  private us: UserService = inject(UserService);

  public isAuthenticated(): Observable<boolean> {
    return from(this.checkAuthenticated());
  }

  public async checkAuthenticated(): Promise<boolean> {
    await this.us.loadLogin();
    const helper = new JwtHelperService();
    if (this.us.logged && this.us.token) {
      return !helper.isTokenExpired(this.us.token);
    }
    return false;
  }
}
