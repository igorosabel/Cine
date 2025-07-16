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
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import Cinema from '@model/cinema';
import Movie from '@model/movie';
import MoviesService from '@services/movies-service';
import NavigationService from '@services/navigation-service';
import UserService from '@services/user-service';
import MovieListComponent from '@shared/components/movie-list/movie-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [
    RouterLink,
    MovieListComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatToolbar,
    MatToolbarRow,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatIcon,
    MatIconButton,
    MatFabButton,
  ],
})
export default class Home implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly moviesService: MoviesService = inject(MoviesService);
  private readonly navigationService: NavigationService =
    inject(NavigationService);
  private readonly userService: UserService = inject(UserService);

  movieList: WritableSignal<Movie[]> = signal<Movie[]>([]);
  currentPage: WritableSignal<number> = signal<number>(
    this.moviesService.currentPage()
  );
  numPages: WritableSignal<number> = signal<number>(
    this.moviesService.numPages()
  );
  loading: WritableSignal<boolean> = signal<boolean>(false);
  loadError: WritableSignal<boolean> = signal<boolean>(false);

  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  opened: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    if (this.currentPage() === 0) {
      this.loadMovies();
    } else {
      this.movieList.set(this.moviesService.cachedMovies());
    }
    this.cinemas.set(this.navigationService.getCinemas());
    this.navigationService.set(['/home']);
  }

  loadMovies(ev: MouseEvent | null = null): void {
    if (ev !== null) {
      ev.preventDefault();
    }
    if (this.currentPage() >= this.numPages() || this.loading()) {
      return; // No cargar más si ya estamos en la última página
    }

    if (this.currentPage() === 0) {
      this.loading.set(true);
    }

    this.moviesService.getMovies().subscribe({
      next: (movieList: Movie[]): void => {
        this.movieList.set(movieList); // Usar el cache del servicio
        this.currentPage.set(this.moviesService.currentPage());
        this.numPages.set(this.moviesService.numPages());
        this.loading.set(false);
      },
      error: (): void => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  toggleSidenav(): void {
    this.opened.update((value: boolean): boolean => !value);
  }

  logout(ev: MouseEvent): void {
    ev.preventDefault();
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
