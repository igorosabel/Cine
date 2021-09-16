import { Component, OnInit }  from '@angular/core';
import { Router }             from '@angular/router';
import { Cinema }             from '../../model/cinema.model';
import { Movie }              from '../../model/movie.model';
import { MovieSearch }        from '../../model/movie-search.model';
import { DataShareService }   from '../../services/data-share.service';
import { DialogService }      from '../../services/dialog.service';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter }     from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MovieSearchResult }  from '../../interfaces/interfaces';

@Component({
	selector: 'app-add-movie',
	templateUrl: './add-movie.component.html',
	styleUrls: ['./add-movie.component.scss'],
	providers: [
		{provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
	]
})
export class AddMovieComponent implements OnInit {
	cinemas: Cinema[]        = [];
	movie: Movie             = new Movie();
	uploadingCover: boolean  = false;
	uploadingTicket: boolean = false;
	searchTimer              = null;
	searching: boolean       = false;
	searchResults: MovieSearch[] = [];
	sending: boolean = false;

	constructor(
		private dss: DataShareService,
		private router: Router,
		private dialog: DialogService,
		private as: ApiService,
		private cms: ClassMapperService
	) {}

	ngOnInit(): void {
		this.cinemas = this.dss.getGlobal('cinemas');
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
		if (this.cinemas.length==0) {
			this.dialog.alert({title: 'Error', content: 'Antes de añadir una película tienes que añadir el cine.', ok: 'Continuar'}).subscribe(result => {
				this.router.navigate(['/home']);
			});
		}
	}

	uploadCover(): void {
		document.getElementById('cover').click();
	}

	onCoverChange(event: Event): void {
		let reader = new FileReader();
		if( (<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files.length > 0) {
			let file = (<HTMLInputElement>event.target).files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.movie.cover = reader.result as string;
				this.movie.coverStatus = 1;
				(<HTMLInputElement>document.getElementById('cover')).value = '';
			};
		}
	}

	uploadTicket(): void {
		document.getElementById('ticket').click();
	}

	onTicketChange(event: Event): void {
		let reader = new FileReader();
		if( (<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files.length > 0) {
			let file = (<HTMLInputElement>event.target).files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.movie.ticket = reader.result as string;
				this.movie.ticketStatus = 1;
				(<HTMLInputElement>document.getElementById('ticket')).value = '';
			};
		}
	}

	searchMovieStart(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.searchMovie();
		}, 500);
    }

    searchMovieStop(): void {
		clearTimeout(this.searchTimer);
    }

	searchMovie(): void {
		if (this.movie.name.length >= 3) {
			this.searchMovieStop();
			this.searching = true;
			this.as.searchMovie(this.movie.name).subscribe(result => {
				this.searching = false;
				this.searchResults = this.cms.getMovieSearches(result.list);
			});
		}
	}

	closeSearchResults(): void {
		this.searchResults = [];
	}

	selectResult(movieResult: MovieSearchResult): void {
		this.as.selectResult(movieResult.id).subscribe(result => {
			let searchResult = this.cms.getMovieDetail(result);
			this.movie.name        = searchResult.title;
			this.movie.cover       = searchResult.poster;
			this.movie.coverStatus = 2;
			this.movie.imdbUrl     = searchResult.imdbUrl;

			this.closeSearchResults();
		});
	}

	saveMovie(): void {
		if (this.movie.name=='') {
			this.dialog.alert({title: 'Error', content: '¡No has introducido el nombre de la película!', ok: 'Continuar'});
			return;
		}
		if (this.movie.idCinema===null) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido cine!', ok: 'Continuar'});
			return;
		}
		if (this.movie.coverStatus===0) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido ninguna carátula!', ok: 'Continuar'});
			return;
		}
		if (this.movie.imdbUrl==='') {
			this.dialog.alert({title: 'Error', content: '¡No has introducido la URL de IMDB!', ok: 'Continuar'});
			return;
		}
		if (this.movie.date==='') {
			this.dialog.alert({title: 'Error', content: '¡No has elegido fecha para la película!', ok: 'Continuar'});
			return;
		}
		if (this.movie.ticketStatus===0) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido ninguna entrada!', ok: 'Continuar'});
			return;
		}

		this.sending = true;
		this.as.saveMovie(this.movie.toInterface()).subscribe(result => {
			if (result.status=='ok') {
				this.dialog.alert({title: '¡Hecho!', content: 'Nueva película guardada.', ok: 'Continuar'}).subscribe(result => {
					this.router.navigate(['/home']);
				});
			}
			else {
				this.sending = false;
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al guardar la película.', ok: 'Continuar'});
			}
		});
	}
}
