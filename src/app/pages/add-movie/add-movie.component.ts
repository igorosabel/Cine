import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
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
import { StatusResult } from '@interfaces/interfaces';
import {
  MovieSearchDetailResult,
  MovieSearchResult,
  MovieSearchResultList,
} from '@interfaces/movie.interfaces';
import Cinema from '@model/cinema.model';
import Companion from '@model/companion.model';
import MovieSearch from '@model/movie-search.model';
import Movie from '@model/movie.model';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import MoviesService from '@services/movies.service';
import NavigationService from '@services/navigation.service';
import AddCompanionComponent from '@shared/components/add-companion/add-companion.component';
import LoadingComponent from '@shared/components/loading/loading.component';
import { Moment } from 'moment';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

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
    LoadingComponent,
  ],
})
export default class AddMovieComponent implements OnInit, OnDestroy {
  private ms: MoviesService = inject(MoviesService);
  private router: Router = inject(Router);
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);
  private os: OverlayService = inject(OverlayService);

  searchBox: Signal<ElementRef> = viewChild.required('searchBox');
  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  companions: WritableSignal<Companion[]> = signal<Companion[]>([]);
  movie: Movie = new Movie();
  movieDate: Moment | null = null;
  uploadingCover: WritableSignal<boolean> = signal<boolean>(false);
  uploadingTicket: WritableSignal<boolean> = signal<boolean>(false);
  searching: WritableSignal<boolean> = signal<boolean>(false);
  destroy$: Subject<void> = new Subject<void>();
  hasText: WritableSignal<boolean> = signal<boolean>(false);
  searchResults: WritableSignal<MovieSearch[]> = signal<MovieSearch[]>([]);
  sending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
    this.companions.set(this.ns.getCompanions());
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
          content: 'Antes de añadir una película tienes que añadir un cine.',
          ok: 'Continuar',
        })
        .subscribe((): void => {
          this.router.navigate(['/home']);
        });
    } else {
      this.searchBox().nativeElement.focus();

      fromEvent(this.searchBox().nativeElement, 'keyup')
        .pipe(
          debounceTime(500),
          map(() => this.searchBox().nativeElement.value.trim()),
          distinctUntilChanged(),
          tap((query: string) => this.hasText.set(query.length > 0)),
          switchMap(
            (query: string): Observable<MovieSearch[]> =>
              this.searchMovie(query)
          ),
          takeUntil(this.destroy$)
        )
        .subscribe((searchResults: MovieSearch[]): void =>
          this.searchResults.set(searchResults)
        );
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

  searchMovie(query: string): Observable<MovieSearch[]> {
    if (query.length < 3) {
      this.searchResults.set([]);
      return new Observable<MovieSearch[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }

    this.searching.set(true);
    return this.as.searchMovie(query).pipe(
      map((result: MovieSearchResultList): MovieSearch[] => {
        this.searching.set(false);
        return this.cms.getMovieSearches(result.list);
      }),
      tap(() => this.searching.set(false))
    );
  }

  clearSearch(): void {
    this.movie.name = '';
    this.searchResults.set([]);
    this.hasText.set(false);
    this.searchBox().nativeElement.focus();
  }

  selectResult(movieResult: MovieSearchResult): void {
    this.as
      .selectResult(movieResult.id)
      .subscribe((result: MovieSearchDetailResult): void => {
        if (result.status === 'ok') {
          this.clearSearch();
          const searchResult: MovieSearch = this.cms.getMovieDetail(result);
          this.movie.name = searchResult.title;
          this.movie.cover = searchResult.poster;
          this.movie.coverStatus = 2;
          this.movie.imdbUrl = searchResult.imdbUrl;
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al seleccionar la película.',
            ok: 'Continuar',
          });
        }
      });
  }

  addCompanion(): void {
    const modalData: Modal = {
      modalTitle: `Nuevo acompañante`,
      modalColor: 'blue',
    };
    const ref = this.os.open(AddCompanionComponent, modalData);
    ref.afterClosed$.subscribe((result): void => {
      if (result.data) {
        this.ns.addCompanion(result.data);
        this.companions.set(this.ns.getCompanions());
        this.movie.companionIds.push(result.data.id);
      }
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
    const formatted: string | undefined = this.movieDate?.format('YYYY-MM-DD');
    if (this.movieDate === null || formatted === undefined) {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido fecha para la película!',
        ok: 'Continuar',
      });
      return;
    }
    this.movie.date = formatted;
    if (this.movie.ticketStatus === 0) {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido ninguna entrada!',
        ok: 'Continuar',
      });
      return;
    }
    this.movie.companions = this.companions().filter(
      (item: Companion): boolean =>
        item.id !== null && this.movie.companionIds.includes(item.id)
    );
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
