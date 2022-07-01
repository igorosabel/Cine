import { Component, Input } from '@angular/core';
import { Movie }            from 'src/app/model/movie.model';

@Component({
	selector: 'app-movie-list',
	templateUrl: './movie-list.component.html',
	styleUrls: []
})
export class MovieListComponent {
	@Input() movies: Movie[] = [];

	constructor() {}
}
