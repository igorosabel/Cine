import { Component, OnInit }  from '@angular/core';
import { Movie }              from 'src/app/model/movie.model';
import { ApiService }         from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
	q: string          = null;
	movies: Movie[]    = [];
	searchTimer        = null;
	searching: boolean = false;

	constructor(
		private as: ApiService,
		private cms: ClassMapperService
	) {}
	ngOnInit(): void {}

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
		if (this.q.length >= 3) {
			this.searchMovieStop();
			this.searching = true;
			this.as.searchTitles(this.q).subscribe(result => {
				this.searching = false;
				this.movies = this.cms.getMovies(result.list);
			});
		}
		else {
			this.movies = [];
		}
	}
}
