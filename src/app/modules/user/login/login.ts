import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, Field, form, required } from '@angular/forms/signals';
import { MatAnchor, MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { ApiStatus } from '@interfaces/contants';
import { LoginData, LoginResult } from '@interfaces/interfaces';
import ApiService from '@services/api-service';
import AuthService from '@services/auth-service';
import ClassMapperService from '@services/class-mapper-service';
import NavigationService from '@services/navigation-service';
import UserService from '@services/user-service';
import LoadingComponent from '@shared/components/loading/loading';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [
    RouterLink,
    FormsModule,
    MatToolbar,
    MatToolbarRow,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatAnchor,
    MatFormField,
    MatLabel,
    MatInput,
    LoadingComponent,
    Field,
  ],
})
export default class Login implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);
  private readonly navigationService: NavigationService = inject(NavigationService);
  private readonly userService: UserService = inject(UserService);

  nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');
  loginModel: WritableSignal<LoginData> = signal<LoginData>({
    name: '',
    pass: '',
  });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.pass);
    disabled(schemaPath.name, (): boolean => this.loginSending());
    disabled(schemaPath.pass, (): boolean => this.loginSending());
  });
  isValid: Signal<boolean> = computed(
    (): boolean =>
      this.loginForm.name().errors().length === 0 && this.loginForm.pass().errors().length === 0
  );
  loginError: WritableSignal<boolean> = signal<boolean>(false);
  loginSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
      return;
    }
    this.nameBox().nativeElement.focus();
  }

  doLogin(ev: MouseEvent): void {
    ev.preventDefault();

    if (!this.isValid()) {
      return;
    }

    this.loginSending.set(true);
    this.apiService.login(this.loginModel()).subscribe({
      next: (result: LoginResult): void => {
        if (result.status === ApiStatus.OK) {
          this.userService.loadUser(result);

          forkJoin({
            cinemas: this.apiService.getCinemas(),
            companions: this.apiService.getCompanions(),
          }).subscribe({
            next: ({ cinemas, companions }) => {
              this.navigationService.setCinemas(this.classMapperService.getCinemas(cinemas.list));
              this.navigationService.setCompanions(
                this.classMapperService.getCompanions(companions.list)
              );

              this.router.navigate(['/home']);
            },
          });
        } else {
          this.loginSending.set(false);
          this.loginError.set(true);
        }
      },
      error: (err: Error): void => {
        this.loginSending.set(false);
        console.error('Login error:', err);
        this.loginError.set(true);
      },
    });
  }
}
