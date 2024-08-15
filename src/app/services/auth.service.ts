import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { AuthCheck } from '@interfaces/interfaces';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable()
export default class AuthService {
  private http: HttpClient = inject(HttpClient);

  private authCheckUrl: string = environment.apiUrl + 'check-auth';

  isAuthenticated(): boolean {
    const authStatus: string | null = localStorage.getItem('authenticated');
    return authStatus === 'true';
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http
      .get<AuthCheck>(this.authCheckUrl, {
        withCredentials: true,
      })
      .pipe(
        map((response: AuthCheck): boolean => response.authenticated),
        tap((authenticated: boolean): void => {
          localStorage.setItem('authenticated', String(authenticated));
        }),
        catchError((): Observable<boolean> => {
          localStorage.setItem('authenticated', 'false');
          return of(false);
        })
      );
  }

  logout(): void {
    localStorage.setItem('authenticated', 'false');
  }
}
