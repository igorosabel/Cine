import {
  Component,
  ElementRef,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { CinemasResult } from '@interfaces/cinema.interfaces';
import { LoginData, LoginResult } from '@interfaces/interfaces';
import { urldecode } from '@osumi/tools';
import ApiService from '@services/api.service';
import AuthService from '@services/auth.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';
import UserService from '@services/user.service';
import LoadingComponent from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
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
  ],
})
export default class LoginComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);
  private auth: AuthService = inject(AuthService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');
  loginData: LoginData = {
    name: '',
    pass: '',
  };
  loginError: WritableSignal<boolean> = signal<boolean>(false);
  loginSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
      return;
    }
    this.nameBox().nativeElement.focus();
  }

  doLogin(ev: MouseEvent): void {
    ev.preventDefault();

    if (this.loginData.name === '' || this.loginData.pass === '') {
      return;
    }

    this.loginSending.set(true);
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      this.loginSending.set(false);
      if (result.status === 'ok') {
        this.user.logged = true;
        this.user.id = result.id;
        this.user.name = urldecode(result.name);
        this.user.token = urldecode(result.token);
        this.user.saveLogin();

        this.as.getCinemas().subscribe((result: CinemasResult): void => {
          this.ns.setCinemas(this.cms.getCinemas(result.list));
          this.router.navigate(['/home']);
        });
      } else {
        this.loginError.set(true);
      }
    });
  }
}
