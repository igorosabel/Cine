import {
  Component,
  InputSignal,
  OnInit,
  WritableSignal,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { CinemaResult } from '@interfaces/cinema.interfaces';
import { NavigationFromType } from '@interfaces/interfaces';
import Cinema from '@model/cinema.model';
import Movie from '@model/movie.model';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';
import MovieListComponent from '@shared/components/movie-list/movie-list.component';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatIcon,
    MatNavList,
    MatListItem,
    MovieListComponent,
  ],
})
export default class CinemaComponent implements OnInit {
  private router: Router = inject(Router);
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  id: InputSignal<number> = input.required<number>();
  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  cinema: WritableSignal<Cinema> = signal<Cinema>(new Cinema());
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
    if (this.cinemas().length == 0) {
      this.router.navigate(['/home']);
    }
    const cinemaFound: Cinema | null = this.ns.getCinema(this.id());
    if (cinemaFound !== null) {
      this.cinema.set(cinemaFound);
    }

    this.as
      .getCinemaMovies(this.id())
      .subscribe((result: CinemaResult): void => {
        if (result.status == 'ok') {
          this.movies.set(this.cms.getMovies(result.list));

          const fromCinema: NavigationFromType = [
            '/cinema',
            this.cinema().id,
            this.cinema().slug,
          ];
          const lastItem: NavigationFromType = this.ns.getLast();
          if (lastItem.join('') != fromCinema.join('')) {
            this.ns.add(fromCinema);
          }
        } else {
          this.dialog
            .alert({
              title: 'Error',
              content: 'No se ha encontrado el cine indicado.',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.router.navigate(['/home']);
            });
        }
      });
  }

  back(): void {
    const current: NavigationFromType = this.ns.get();
    const previous: NavigationFromType = this.ns.get();
    if (previous.length === 0) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(previous);
    }
  }
}
