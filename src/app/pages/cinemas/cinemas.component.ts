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
import { CinemasResult } from '@interfaces/cinema.interfaces';
import { StatusResult } from '@interfaces/interfaces';
import Cinema from '@model/cinema.model';
import { DialogOptions, DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';

@Component({
  selector: 'app-cinemas',
  templateUrl: './cinemas.component.html',
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
export default class CinemasComponent implements OnInit {
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
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
      .subscribe((result: DialogOptions): void => {
        if (result && result.fields !== undefined) {
          this.newCinema(result.fields[0].value);
        }
      });
  }

  newCinema(name: string): void {
    this.as.addCinema(name).subscribe((result: StatusResult): void => {
      if (result.status == 'ok') {
        this.cinemas.set([]);
        this.ns.setCinemas([]);

        this.getCinemas();
      } else {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al guardar el nuevo cine.',
          ok: 'Continuar',
        });
      }
    });
  }

  getCinemas(): void {
    this.as.getCinemas().subscribe((result: CinemasResult): void => {
      this.cinemas.set(this.cms.getCinemas(result.list));
      this.ns.setCinemas(this.cinemas());
    });
  }
}
