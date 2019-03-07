import { Component, OnInit }          from '@angular/core';
import { Router }                     from '@angular/router';
import { Subscription }               from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { DataShareService }           from '../../services/data-share.service';
import { DialogService }              from '../../services/dialog.service';
import { ApiService }                 from '../../services/api.service';
import { Cinema, Movie }              from '../../interfaces/interfaces';

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
	uploadingCover: boolean = false;
	uploadingTicket: boolean = false;

	constructor(private dss: DataShareService,
	            private router: Router,
	            private dialog: DialogService,
				private as: ApiService,
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
				this.movie.cover = reader.result;
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
				this.movie.ticket = reader.result;
				(<HTMLInputElement>document.getElementById('ticket')).value = '';
			};
		}
	}

	saveMovie() {
		
	}
}