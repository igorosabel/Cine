import {
  Component,
  InputSignal,
  OnInit,
  WritableSignal,
  inject,
  input,
  signal,
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
import { CinemasResult } from '@interfaces/cinema';
import { ApiStatus } from '@interfaces/contants';
import { StatusResult } from '@interfaces/interfaces';
import Cinema from '@model/cinema';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api-service';
import ClassMapperService from '@services/class-mapper-service';
import NavigationService from '@services/navigation-service';
import LoadingComponent from '@shared/components/loading/loading';

@Component({
  selector: 'app-edit-cinema',
  templateUrl: './edit-cinema.html',
  imports: [
    RouterLink,
    FormsModule,
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    MatIconButton,
    MatButton,
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
export default class EditCinema implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService =
    inject(ClassMapperService);
  private readonly navigationService: NavigationService =
    inject(NavigationService);

  id: InputSignal<number> = input.required<number>();
  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  selectedCinema: WritableSignal<Cinema> = signal<Cinema>(new Cinema());
  editSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.cinemas.set(this.navigationService.getCinemas());
    if (this.cinemas().length === 0) {
      this.router.navigate(['/cinemas']);
    }
    const cinema: Cinema | null = this.navigationService.getCinema(this.id());
    if (cinema !== null) {
      this.selectedCinema.set(cinema);
    }
  }

  doEdit(ev: MouseEvent): void {
    ev.preventDefault();
    if (this.selectedCinema()?.name === '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No puedes dejar el nombre en blanco!',
        ok: 'Continuar',
      });
      return;
    }

    this.editSending.set(true);
    const cinema: Cinema | null = this.selectedCinema();
    if (cinema !== null) {
      this.apiService.editCinema(cinema.toInterface()).subscribe({
        next: (result: StatusResult): void => {
          this.editSending.set(false);
          if (result.status === ApiStatus.OK) {
            this.navigationService.updateCinema(cinema);
            this.dialog.alert({
              title: 'Cine actualizado',
              content: 'El nombre del cine ha sido actualizado.',
              ok: 'Continuar',
            });
          }
        },
        error: (err: Error): void => {
          console.error('Error al editar cine:', err);
          this.editSending.set(false);
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al actualizar el cine.',
            ok: 'Continuar',
          });
        },
      });
    }
  }

  deleteCinema(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.dialog
      .confirm({
        title: 'Borrar cine',
        content:
          '¿Estás seguro de querer borrar este cine? También se borrarán todas sus entradas.',
        ok: 'Continuar',
        cancel: 'Cancelar',
      })
      .subscribe((result: boolean): void => {
        if (result) {
          this.deleteCinemaConfirm();
        }
      });
  }

  deleteCinemaConfirm(): void {
    const id: number | null | undefined = this.selectedCinema()?.id;
    if (id !== null && id !== undefined) {
      this.apiService.deleteCinema(id).subscribe({
        next: (result: StatusResult): void => {
          if (result.status === ApiStatus.OK) {
            this.dialog
              .alert({
                title: 'Cine borrado',
                content: 'El cine y todas sus entradas han sido borradas.',
                ok: 'Continuar',
              })
              .subscribe((): void => {
                this.navigationService.setCinemas([]);
                this.getCinemas();
              });
          }
        },
        error: (err: Error): void => {
          console.error('Error al borrar cine:', err);
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al borrar el cine.',
            ok: 'Continuar',
          });
        },
      });
    }
  }

  getCinemas(): void {
    this.apiService.getCinemas().subscribe({
      next: (result: CinemasResult): void => {
        this.cinemas.set(this.classMapperService.getCinemas(result.list));
        this.navigationService.setCinemas(this.cinemas());
        this.router.navigate(['/cinemas']);
      },
      error: (err: Error): void => {
        console.error('Error al obtener cines:', err);
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al obtener la lista de cines.',
          ok: 'Continuar',
        });
      },
    });
  }
}
