import {
  Component,
  ElementRef,
  OnInit,
  Signal,
  WritableSignal,
  computed,
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
import { ApiStatus } from '@interfaces/contants';
import { LoginResult, RegisterData } from '@interfaces/interfaces';
import ApiService from '@services/api-service';
import ClassMapperService from '@services/class-mapper-service';
import NavigationService from '@services/navigation-service';
import UserService from '@services/user-service';
import LoadingComponent from '@shared/components/loading/loading';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
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
export default class Register implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService =
    inject(ClassMapperService);
  private readonly navigationService: NavigationService =
    inject(NavigationService);
  private readonly userService: UserService = inject(UserService);

  nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');
  name: WritableSignal<string> = signal<string>('');
  pass: WritableSignal<string> = signal<string>('');
  conf: WritableSignal<string> = signal<string>('');
  registerNameError: WritableSignal<boolean> = signal<boolean>(false);
  registerPassError: WritableSignal<boolean> = signal<boolean>(false);
  registerSending: WritableSignal<boolean> = signal<boolean>(false);

  private registerData: Signal<RegisterData> = computed((): RegisterData => {
    return {
      name: this.name(),
      pass: this.pass(),
      conf: this.conf(),
    };
  });

  ngOnInit(): void {
    this.nameBox().nativeElement.focus();
  }

  doRegister(ev: MouseEvent): void {
    ev.preventDefault();

    if (this.name() === '' || this.pass() === '' || this.conf() === '') {
      return;
    }

    this.registerNameError.set(false);
    this.registerPassError.set(false);
    if (this.pass() !== this.conf()) {
      this.registerPassError.set(true);
      return;
    }

    this.registerSending.set(true);
    this.apiService.register(this.registerData()).subscribe({
      next: (result: LoginResult): void => {
        this.registerSending.set(false);
        if (result.status === ApiStatus.OK) {
          this.userService.loadUser(result);

          forkJoin({
            cinemas: this.apiService.getCinemas(),
            companions: this.apiService.getCompanions(),
          }).subscribe({
            next: ({ cinemas, companions }) => {
              this.navigationService.setCinemas(
                this.classMapperService.getCinemas(cinemas.list)
              );
              this.navigationService.setCompanions(
                this.classMapperService.getCompanions(companions.list)
              );

              this.router.navigate(['/home']);
            },
          });
        } else {
          this.registerNameError.set(true);
        }
      },
      error: (err: Error): void => {
        this.registerSending.set(false);
        console.error('Register error:', err);
        this.registerNameError.set(true);
      },
    });
  }
}
