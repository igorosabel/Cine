import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Cinema }                        from '../../model/cinema.model';
import { Movie }                         from '../../model/movie.model';
import { DataShareService }              from '../../services/data-share.service';
import { DialogService }                 from '../../services/dialog.service';
import { ApiService }                    from '../../services/api.service';
import { ClassMapperService }            from '../../services/class-mapper.service';

@Component({
	selector: 'app-cinema',
	templateUrl: './cinema.component.html',
	styleUrls: []
})
export class CinemaComponent implements OnInit {
	from: any         = [];
	cinemas: Cinema[] = [];
	cinema: Cinema    = null;
	movies: Movie[]   = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private dss: DataShareService,
		private router: Router,
		private dialog: DialogService,
		private as: ApiService,
		private cms: ClassMapperService
	) {}

	ngOnInit(): void {
		this.cinemas = this.dss.getGlobal('cinemas');
		if (this.cinemas.length==0) {
			this.router.navigate(['/home']);
		}
		this.activatedRoute.params.subscribe((params: Params) => {
			const id: number = params.id;
			this.cinema = this.cinemas[this.cinemas.findIndex(x => x.id==id)];

			this.as.getCinemaMovies(id).subscribe(result => {
				if (result.status=='ok') {
					this.movies = this.cms.getMovies(result.list);

					const fromCinema = ['/cinema', this.cinema.id, this.cinema.slug];
					this.from = this.dss.getGlobal('from');
					if (this.from[this.from.length-1].join('')!=fromCinema.join('')) {
						this.from.push(fromCinema);
					}
					this.dss.setGlobal('from', this.from);
				}
				else {
					this.dialog
						.alert({title: 'Error', content: 'No se ha encontrado el cine indicado.', ok: 'Continuar'})
						.subscribe(result => {
							this.router.navigate(['/home']);
						});
				}
			});
		});
	}

	back(): void {
		const current = this.from.pop();
		const previous = this.from.pop();
		this.dss.setGlobal('from', this.from);
		this.router.navigate(previous);
	}
}
