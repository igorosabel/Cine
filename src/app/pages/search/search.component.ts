import { Component, OnInit } from '@angular/core';
import { Movie } from '../../model/movie.model';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	q: string = null;
	movies: Movie[] = [];
	searching: boolean = false;

	constructor() {}
	ngOnInit(): void {}

	searchMovieStart(): void {

	}
}
