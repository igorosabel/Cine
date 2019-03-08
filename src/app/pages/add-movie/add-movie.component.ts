import { Component, OnInit }                from '@angular/core';
import { Router }                           from '@angular/router';
import { Subscription }                     from 'rxjs';
import { MediaChange, MediaObserver }       from '@angular/flex-layout';
import { DataShareService }                 from '../../services/data-share.service';
import { DialogService }                    from '../../services/dialog.service';
import { ApiService }                       from '../../services/api.service';
import { CommonService }                    from '../../services/common.service';
import { Cinema, Movie, MovieSearchResult } from '../../interfaces/interfaces';

@Component({
  selector: 'app-add-movie',
  templateUrl: './html/add-movie.component.html',
  styleUrls: ['./css/add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
	watcher: Subscription;
	isMobile: boolean = false;
	cinemas: Cinema[] = [];
	movie: Movie = {
		id: null,
		idCinema: null,
		name: '',
		cover: 'http://apicine.osumi.es/cover/def.jpg',
		ticket: 'http://apicine.osumi.es/cover/def.jpg',
		imdbUrl: '',
		date: ''
	};
	uploadingCover: boolean  = false;
	uploadingTicket: boolean = false;
	searchTimer              = null;
	searching: boolean       = false;
	searchResults: MovieSearchResult[] = [];

	constructor(private dss: DataShareService,
	            private router: Router,
	            private dialog: DialogService,
				private as: ApiService,
				private cs: CommonService,
				private mediaObserver: MediaObserver) {
		this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
			if ( change.mqAlias == 'xs') {
				this.isMobile = true;
			}
		});
	}

	ngOnInit() {
		this.cinemas = this.dss.getGlobal('cinemas');
		if (this.cinemas.length==0){
			this.dialog.alert({title: 'Error', content: 'Antes de añadir una película tienes que añadir el cine.', ok: 'Continuar'}).subscribe(result => {
				this.router.navigate(['/home']);
			});
		}
	}

	uploadCover() {
		document.getElementById('cover').click();
	}
	
	onCoverChange(event) {
		let reader = new FileReader();
		if( (<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files.length > 0) {
			let file = (<HTMLInputElement>event.target).files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.movie.cover = reader.result as string;
				(<HTMLInputElement>document.getElementById('cover')).value = '';
			};
		}
	}

	uploadTicket() {
		document.getElementById('ticket').click();
	}
	
	onTicketChange(event) {
		let reader = new FileReader();
		if( (<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files.length > 0) {
			let file = (<HTMLInputElement>event.target).files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.movie.ticket = reader.result as string;
				(<HTMLInputElement>document.getElementById('ticket')).value = '';
			};
		}
	}
	
	searchMovieStart(){
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.searchMovie();
		}, 500);
    }

    searchMovieStop(){
		clearTimeout(this.searchTimer);
    }
	
	searchMovie() {
		if (this.movie.name.length<3){
			return;
		}
		this.searchMovieStop();
		this.searching = true;
		this.as.searchMovie(this.movie.name).subscribe(result => {
			this.searching = false;
			this.searchResults = result.list;
		});
	}
	
	closeSearchResults() {
		this.searchResults = [];
	}
	
	selectResult(movieResult: MovieSearchResult) {
		console.log(movieResult);
		this.as.selectResult(movieResult.id).subscribe(result => {
			this.movie.name    = this.cs.urldecode(result.title);
			this.movie.cover   = this.cs.urldecode(result.poster);
			this.movie.imdbUrl = this.cs.urldecode(result.imdbUrl);
			
			this.closeSearchResults();
		});
	}

	saveMovie() {
		
	}
}