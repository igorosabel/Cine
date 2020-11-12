import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Movie, Cinema }     from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { DataShareService }  from '../../services/data-share.service';
import { UserService }       from '../../services/user.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	page: number       = 0;
	numPages: number   = 0;
	movies: Movie[]    = [];
	cinemas: Cinema[]  = [];
	loading: boolean   = true;
	loadError: boolean = false;
	opened: boolean    = false;

	constructor(
		private as: ApiService,
		private dss: DataShareService,
		private user: UserService,
		private router: Router
	) { }

	ngOnInit() {
		this.getMovies();
		this.cinemas = this.dss.getGlobal('cinemas');
		this.dss.setGlobal('from', [ ['/home'] ]);
	}

	getMovies(ev=null) {
		ev && ev.preventDefault();
		this.page++;
		this.as.getMovies(this.page)
			.subscribe(result => {
				this.movies   = this.movies.concat(result.list);
				this.numPages = result.numPages;
				this.loading  = false;
			},
			error => {
				this.loading    = false;
				this.loadError  = true;
			});
	}

	toggleSidenav() {
		this.opened = !this.opened;
	}

  logout(ev) {
		ev.preventDefault();
		this.user.logout();
		this.router.navigate(['/']);
  }
}