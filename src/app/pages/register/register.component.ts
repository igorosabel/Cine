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
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import {
  CinemasResult,
  LoginResult,
  RegisterData,
} from '@interfaces/interfaces';
import { urldecode } from '@osumi/tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';
import UserService from '@services/user.service';
import LoadingComponent from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    RouterLink,
    FormsModule,
    MatToolbar,
    MatToolbarRow,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatFormField,
    MatLabel,
    MatInput,
    LoadingComponent,
  ],
})
export default class RegisterComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');
  registerData: RegisterData = {
    name: '',
    pass: '',
    conf: '',
  };
  registerNameError: WritableSignal<boolean> = signal<boolean>(false);
  registerPassError: WritableSignal<boolean> = signal<boolean>(false);
  registerSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.nameBox().nativeElement.focus();
  }

  doRegister(ev: MouseEvent): void {
    ev.preventDefault();

    if (
      this.registerData.name === '' ||
      this.registerData.pass === '' ||
      this.registerData.conf === ''
    ) {
      return;
    }

    this.registerNameError.set(false);
    this.registerPassError.set(false);
    if (this.registerData.pass !== this.registerData.conf) {
      this.registerPassError.set(true);
      return;
    }

    this.registerSending.set(true);
    this.as
      .register(this.registerData)
      .subscribe((result: LoginResult): void => {
        this.registerSending.set(false);
        if (result.status === 'ok') {
          this.user.logged = true;
          this.user.id = result.id;
          this.user.name = urldecode(result.name);
          this.user.token = urldecode(result.token);
          this.user.saveLogin();

          this.as.getCinemas().subscribe((result: CinemasResult): void => {
            this.ns.setCinemas(this.cms.getCinemas(result.list));
          });

          this.router.navigate(['/home']);
        } else {
          this.registerNameError.set(true);
        }
      });
  }
}
