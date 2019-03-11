import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { DataShareService }              from '../../services/data-share.service';
import { CommonService }                 from '../../services/common.service';
import { DialogService }                 from '../../services/dialog.service';
import { ApiService }                    from '../../services/api.service';
import { Cinema, Movie }                 from '../../interfaces/interfaces';

@Component({
  selector: 'app-movie',
  templateUrl: './html/movie.component.html',
  styleUrls: ['./css/movie.component.css']
})
export class MovieComponent implements OnInit {
  cinemas: Cinema[] = [];
  selectedCinema: Cinema = null;
  movie = {
    id: null,
  	idCinema: null,
  	name: '',
  	slug: '',
  	cover: '',
  	ticket: '',
  	imdbUrl: '',
  	date: ''
  } as Movie;
  showCover: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
	            private dss: DataShareService,
	            private router: Router,
	            private cs: CommonService,
	            private dialog: DialogService,
				      private as: ApiService) { }
	ngOnInit() {
    this.cinemas = this.dss.getGlobal('cinemas');
		if (this.cinemas.length==0){
			this.router.navigate(['/home']);
		}
    this.activatedRoute.params.subscribe((params: Params) => {
			const id: number = params.id;
      this.as.getMovie(id).subscribe(result => {
        if (result.status=='ok'){
          this.movie.id       = result.movie.id;
          this.movie.idCinema = result.movie.idCinema;
          this.movie.name     = this.cs.urldecode(result.movie.name);
          this.movie.slug     = result.movie.slug;
          this.movie.cover    = this.cs.urldecode(result.movie.cover);
          this.movie.ticket   = this.cs.urldecode(result.movie.ticket);
          this.movie.imdbUrl  = this.cs.urldecode(result.movie.imdbUrl);
          this.movie.date     = this.cs.urldecode(result.movie.date);

    			this.selectedCinema = this.cinemas[this.cinemas.findIndex(x => x.id==this.movie.idCinema)];
    			this.selectedCinema.name = this.cs.urldecode(this.selectedCinema.name);
        }
        else{
          this.dialog
              .alert({title: 'Error', content: 'No se ha encontrado la película indicada.', ok: 'Continuar'})
              .subscribe(result => {
                this.router.navigate(['/home']);
              });
        }
      });
    });
  }

  openCover() {
    this.showCover = !this.showCover;
  }

  selectCinema() {
    
  }
}