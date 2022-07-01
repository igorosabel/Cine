import { Component, OnInit }  from '@angular/core';
import { Router }             from '@angular/router';
import { Movie }              from 'src/app/model/movie.model';
import { Cinema }             from 'src/app/model/cinema.model';
import { ApiService }         from 'src/app/services/api.service';
import { DataShareService }   from 'src/app/services/data-share.service';
import { UserService }        from 'src/app/services/user.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	page: number        = 0;
	numPages: number    = 0;
	movies: Movie[]     = [];
	cinemas: Cinema[]   = [];
	loading: boolean    = true;
	loadError: boolean  = false;
	opened: boolean     = false;

	constructor(
		private as: ApiService,
		private dss: DataShareService,
		private user: UserService,
		private router: Router,
		private cms: ClassMapperService
	) { }

	ngOnInit(): void {
		this.getMovies();
		this.cinemas = this.dss.getGlobal('cinemas');
		this.dss.setGlobal('from', [ ['/home'] ]);
	}

	getMovies(ev=null): void {
		ev && ev.preventDefault();
		this.page++;
		this.as.getMovies(this.page)
			.subscribe(result => {
				this.movies   = this.movies.concat(this.cms.getMovies(result.list));
				this.numPages = result.numPages;
				this.loading  = false;
			},
			error => {
				this.loading    = false;
				this.loadError  = true;
			});
	}

	toggleSidenav(): void {
		this.opened = !this.opened;
	}

	logout(ev: MouseEvent): void {
		ev.preventDefault();
		this.user.logout();
		this.router.navigate(['/']);
	}
}
