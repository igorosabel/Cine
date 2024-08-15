import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import AuthService from '@services/auth.service';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class AuthGuard {
  public auth: AuthService = inject(AuthService);
  public router: Router = inject(Router);

  canActivate(): Observable<boolean> {
    if (this.auth.isAuthenticated()) {
      return of(true);
    }

    return this.auth.checkAuthStatus().pipe(
      tap((isAuthenticated: boolean): void => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
