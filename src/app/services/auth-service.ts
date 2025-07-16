import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import UserService from '@services/user-service';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  private userService: UserService = inject(UserService);

  public isAuthenticated(): Observable<boolean> {
    return from(this.checkAuthenticated());
  }

  public async checkAuthenticated(): Promise<boolean> {
    await this.userService.loadLogin();
    const helper = new JwtHelperService();
    if (this.userService.logged && this.userService.token) {
      return !helper.isTokenExpired(this.userService.token);
    }
    return false;
  }
}
