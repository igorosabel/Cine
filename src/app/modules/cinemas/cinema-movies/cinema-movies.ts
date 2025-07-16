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
import { CinemaResult } from '@interfaces/cinema';
import { ApiStatus } from '@interfaces/contants';
import { NavigationFromType } from '@interfaces/interfaces';
import Cinema from '@model/cinema';
import Movie from '@model/movie';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api-service';
import ClassMapperService from '@services/class-mapper-service';
import NavigationService from '@services/navigation-service';
import MovieListComponent from '@shared/components/movie-list/movie-list';

@Component({
  selector: 'app-cinema-movies',
  templateUrl: './cinema-movies.html',
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
export default class CinemaMovies implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService =
    inject(ClassMapperService);
  private readonly navigationService: NavigationService =
    inject(NavigationService);

  id: InputSignal<number> = input.required<number>();
  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  cinema: WritableSignal<Cinema> = signal<Cinema>(new Cinema());
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);

  ngOnInit(): void {
    this.cinemas.set(this.navigationService.getCinemas());
    if (this.cinemas().length === 0) {
      this.router.navigate(['/home']);
    }
    const cinemaFound: Cinema | null = this.navigationService.getCinema(
      this.id()
    );
    if (cinemaFound !== null) {
      this.cinema.set(cinemaFound);
    }

    this.apiService.getCinemaMovies(this.id()).subscribe({
      next: (result: CinemaResult): void => {
        if (result.status === ApiStatus.OK) {
          this.movies.set(this.classMapperService.getMovies(result.list));

          const fromCinema: NavigationFromType = [
            '/cinema',
            this.cinema().id,
            this.cinema().slug,
          ];
          const lastItem: NavigationFromType = this.navigationService.getLast();
          if (lastItem.join('') != fromCinema.join('')) {
            this.navigationService.add(fromCinema);
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
      },
      error: (err: Error): void => {
        console.error('Error al cargar las películas del cine', err);
        this.dialog
          .alert({
            title: 'Error',
            content: 'No se han podido cargar las películas del cine.',
            ok: 'Continuar',
          })
          .subscribe((): void => {
            this.router.navigate(['/home']);
          });
      },
    });
  }

  back(): void {
    // Saco el primer elemento de la navegación que es la página actual
    let previous: NavigationFromType = this.navigationService.get();
    // Vuelvo a sacar otro elemento de navegación que será la página anterior
    previous = this.navigationService.get();
    if (previous.length === 0) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(previous);
    }
  }
}
