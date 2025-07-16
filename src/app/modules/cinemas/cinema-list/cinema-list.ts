import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemIcon,
  MatNavList,
} from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { CinemasResult } from '@interfaces/cinema';
import { ApiStatus } from '@interfaces/contants';
import { StatusResult } from '@interfaces/interfaces';
import Cinema from '@model/cinema';
import { DialogField, DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api-service';
import ClassMapperService from '@services/class-mapper-service';
import NavigationService from '@services/navigation-service';

@Component({
  selector: 'app-cinema-list',
  templateUrl: './cinema-list.html',
  imports: [
    RouterLink,
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatFabButton,
    MatIcon,
    MatNavList,
    MatListItem,
    MatListItemIcon,
  ],
})
export default class CinemaList implements OnInit {
  private readonly dialog: DialogService = inject(DialogService);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService =
    inject(ClassMapperService);
  private readonly navigationService: NavigationService =
    inject(NavigationService);

  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);

  ngOnInit(): void {
    this.cinemas.set(this.navigationService.getCinemas());
  }

  addCinema(): void {
    this.dialog
      .form({
        title: 'Añadir cine',
        content: 'Introduce el nombre del nuevo cine',
        fields: [
          {
            title: 'Nombre',
            type: 'text',
            value: '',
          },
        ],
        ok: 'Continuar',
        cancel: 'Cancelar',
      })
      .subscribe((result: DialogField[]): void => {
        if (result && result.length > 0) {
          this.newCinema(result[0].value);
        }
      });
  }

  newCinema(name: string): void {
    this.apiService.addCinema(name).subscribe({
      next: (result: StatusResult): void => {
        if (result.status === ApiStatus.OK) {
          this.cinemas.set([]);
          this.navigationService.setCinemas([]);

          this.getCinemas();
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al guardar el nuevo cine.',
            ok: 'Continuar',
          });
        }
      },
      error: (err: Error): void => {
        console.error('Error al añadir cine:', err);
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al guardar el nuevo cine.',
          ok: 'Continuar',
        });
      },
    });
  }

  getCinemas(): void {
    this.apiService.getCinemas().subscribe({
      next: (result: CinemasResult): void => {
        this.cinemas.set(this.classMapperService.getCinemas(result.list));
        this.navigationService.setCinemas(this.cinemas());
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
