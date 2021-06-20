import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../../model/movie.model';

@Component({
	selector: 'app-movie-list',
	templateUrl: './movie-list.component.html',
	styleUrls: []
})
export class MovieListComponent implements OnInit {
	@Input() movies: Movie[]   = [];

	constructor() {}

	ngOnInit(): void {}
}
