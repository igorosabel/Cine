import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Movie }                         from '../../model/movie.model';
import { Cinema }                        from '../../model/cinema.model';
import { DataShareService }              from '../../services/data-share.service';
import { CommonService }                 from '../../services/common.service';
import { DialogService }                 from '../../services/dialog.service';
import { ApiService }                    from '../../services/api.service';
import { ClassMapperService }            from '../../services/class-mapper.service';

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
	from: any = [];
	cinemas: Cinema[] = [];
	selectedCinema: Cinema = null;
	movie: Movie = new Movie();
	showCover: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private dss: DataShareService,
		private router: Router,
		private cs: CommonService,
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
			this.as.getMovie(id).subscribe(result => {
				if (result.status=='ok') {
					this.movie = this.cms.getMovie(result.movie);

					this.selectedCinema = this.cinemas[this.cinemas.findIndex(x => x.id==this.movie.idCinema)];
					this.selectedCinema.name = this.cs.urldecode(this.selectedCinema.name);

					const fromMovie = ['/movie', this.movie.id, this.movie.slug];
					this.from = this.dss.getGlobal('from');
					if (this.from[this.from.length-1].join('')!=fromMovie.join('')){
						this.from.push(fromMovie);
					}
					this.dss.setGlobal('from', this.from);
				}
				else {
					this.dialog
						.alert({title: 'Error', content: 'No se ha encontrado la película indicada.', ok: 'Continuar'})
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

	openCover(): void {
		this.showCover = !this.showCover;
	}

	selectCinema(): void {
		this.router.navigate(['/cinema', this.selectedCinema.id, this.selectedCinema.slug]);
	}
}
