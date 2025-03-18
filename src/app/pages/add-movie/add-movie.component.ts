import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MatActionList,
  MatListItem,
  MatListItemAvatar,
  MatListItemTitle,
} from '@angular/material/list';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import MoviesService from '@app/services/movies.service';
import {
  MovieSearchDetailResult,
  MovieSearchResult,
  MovieSearchResultList,
  StatusResult,
} from '@interfaces/interfaces';
import Cinema from '@model/cinema.model';
import MovieSearch from '@model/movie-search.model';
import Movie from '@model/movie.model';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
  imports: [
    FormsModule,
    RouterLink,
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatActionList,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatSelect,
    MatOption,
    MatDatepickerModule,
    MatSuffix,
  ],
})
export default class AddMovieComponent implements OnInit {
  private ms: MoviesService = inject(MoviesService);
  private router: Router = inject(Router);
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  movie: Movie = new Movie();
  uploadingCover: WritableSignal<boolean> = signal<boolean>(false);
  uploadingTicket: WritableSignal<boolean> = signal<boolean>(false);
  searchTimer: number = -1;
  searching: WritableSignal<boolean> = signal<boolean>(false);
  searchResults: WritableSignal<MovieSearch[]> = signal<MovieSearch[]>([]);
  sending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
    this.movie = new Movie(
      null,
      null,
      '',
      '',
      'https://apicine.osumi.es/cover/def.webp',
      'https://apicine.osumi.es/cover/def.webp',
      '',
      ''
    );
    if (this.cinemas().length == 0) {
      this.dialog
        .alert({
          title: 'Error',
          content: 'Antes de añadir una película tienes que añadir el cine.',
          ok: 'Continuar',
        })
        .subscribe((): void => {
          this.router.navigate(['/home']);
        });
    }
  }

  uploadCover(): void {
    const obj: HTMLElement | null = document.getElementById('cover');
    if (obj !== null) {
      obj.click();
    }
  }

  onCoverChange(event: Event): void {
    const reader: FileReader = new FileReader();
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if (files !== null && files.length > 0) {
      this.uploadingCover.set(true);
      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.movie.cover = reader.result as string;
        this.movie.coverStatus = 1;
        (document.getElementById('cover') as HTMLInputElement).value = '';
        this.uploadingCover.set(false);
      };
    }
  }

  uploadTicket(): void {
    const obj: HTMLElement | null = document.getElementById('ticket');
    if (obj !== null) {
      obj.click();
    }
  }

  onTicketChange(event: Event): void {
    const reader: FileReader = new FileReader();
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if (files !== null && files.length > 0) {
      this.uploadingTicket.set(true);
      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.movie.ticket = reader.result as string;
        this.movie.ticketStatus = 1;
        (document.getElementById('ticket') as HTMLInputElement).value = '';
        this.uploadingTicket.set(false);
      };
    }
  }

  searchMovieStart(): void {
    this.searchMovieStop();
    this.searchTimer = window.setTimeout((): void => {
      this.searchMovie();
    }, 500);
  }

  searchMovieStop(): void {
    window.clearTimeout(this.searchTimer);
  }

  searchMovie(): void {
    if (this.movie.name !== null && this.movie.name.length >= 3) {
      this.searchMovieStop();
      this.searching.set(true);
      this.as
        .searchMovie(this.movie.name)
        .subscribe((result: MovieSearchResultList): void => {
          this.searching.set(false);
          this.searchResults.set(this.cms.getMovieSearches(result.list));
        });
    }
  }

  closeSearchResults(): void {
    this.searchResults.set([]);
  }

  selectResult(movieResult: MovieSearchResult): void {
    this.as
      .selectResult(movieResult.id)
      .subscribe((result: MovieSearchDetailResult): void => {
        const searchResult: MovieSearch = this.cms.getMovieDetail(result);
        this.movie.name = searchResult.title;
        this.movie.cover = searchResult.poster;
        this.movie.coverStatus = 2;
        this.movie.imdbUrl = searchResult.imdbUrl;

        this.closeSearchResults();
      });
  }

  saveMovie(): void {
    if (this.movie.name == '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has introducido el nombre de la película!',
        ok: 'Continuar',
      });
      return;
    }
    if (this.movie.idCinema === null) {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido cine!',
        ok: 'Continuar',
      });
      return;
    }
    if (this.movie.coverStatus === 0) {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido ninguna carátula!',
        ok: 'Continuar',
      });
      return;
    }
    if (this.movie.imdbUrl === '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has introducido la URL de IMDB!',
        ok: 'Continuar',
      });
      return;
    }
    if (this.movie.date === '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido fecha para la película!',
        ok: 'Continuar',
      });
      return;
    }
    if (this.movie.ticketStatus === 0) {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido ninguna entrada!',
        ok: 'Continuar',
      });
      return;
    }

    this.sending.set(true);
    this.as
      .saveMovie(this.movie.toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status == 'ok') {
          this.dialog
            .alert({
              title: '¡Hecho!',
              content: 'Nueva película guardada.',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.ms.clearCache();
              this.router.navigate(['/home']);
            });
        } else {
          this.sending.set(false);
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al guardar la película.',
            ok: 'Continuar',
          });
        }
      });
  }
}
