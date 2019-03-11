import { Component, OnInit } from '@angular/core';
import { Movie, Cinema }     from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { DataShareService }  from '../../services/data-share.service';

@Component({
  selector: 'app-home',
  templateUrl: './html/home.component.html',
  styleUrls: ['./css/home.component.css']
})
export class HomeComponent implements OnInit {
	page: number      = 0;
  numPages: number  = 0;
	movies: Movie[]   = [];
	cinemas: Cinema[] = [];
	opened: boolean   = false;

	constructor(private as: ApiService, private dss: DataShareService) { }

	ngOnInit() {
		this.getMovies();
		this.cinemas = this.dss.getGlobal('cinemas');
	}

	getMovies(ev=null) {
    if (ev){
      ev.preventDefault();
    }
		this.page++;
		this.as.getMovies(this.page).subscribe(result => {
			this.movies   = this.movies.concat(result.list);
      this.numPages = result.numPages;
		});
	}

	toggleSidenav() {
		this.opened = !this.opened;
	}
}