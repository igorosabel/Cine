import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { DataShareService }              from '../../services/data-share.service';
import { CommonService }                 from '../../services/common.service';
import { DialogService }                 from '../../services/dialog.service';
import { Cinema }                        from '../../interfaces/interfaces';

@Component({
  selector: 'app-edit-cinema',
  templateUrl: './html/edit-cinema.component.html',
  styleUrls: ['./css/edit-cinema.component.css']
})
export class EditCinemaComponent implements OnInit {
  cinemas: Cinema[] = [];
  selectedCinema: Cinema = null;
  editSending: boolean = false;

	constructor(private activatedRoute: ActivatedRoute,
	            private dss: DataShareService,
	            private router: Router,
	            private cs: CommonService,
	            private dialog: DialogService) { }

	ngOnInit() {
  	  this.cinemas = this.dss.getGlobal('cinemas');
  	  if (this.cinemas.length==0){
    	  this.router.navigate(['/cinemas']);
  	  }
  	  this.activatedRoute.params.subscribe((params: Params) => {
      const id: number = params.id;
      const ind = this.cinemas.findIndex(x => x.id==id);
      this.selectedCinema = this.cinemas[ind];
      this.selectedCinema.name = this.cs.urldecode(this.selectedCinema.name);
    });
	}
	
	doEdit(ev) {
  	  ev.preventDefault();
  	  if (this.cinema==''){
    	  this.dialog.alert({title: 'Error', content: '¡No puedes dejar el nombre en blanco!', ok: 'Continuar'});
    	  return;
  	  }
  	  
  	  
	}
	
	deleteCinema() {
  	  this.dialog.confirm({title: 'Borrar cine',
    	                     content: '¿Estás seguro de querer borrar este cine? También se borrarán todas sus entradas.',
    	                     ok: 'Continuar',
    	                     cancel: 'Cancelar'}).subscribe(result => {
    	  if (result){
      	  this.as.deleteCinema(this.selectedCinema.id).subscribe(result => {
        	  if (result.status=='ok'){
          	  this.dialog.alert({title: 'Cine borrado', content: 'El cine y todas sus entradas han sido borradas.', ok: 'Continuar'}).subscribe(result => {
            	  this.dss.removeGlobal('cinemas');
            	  this.router.navigate(['/cinemas']);
             });
        	  }
      	  });
    	  }
  	  });
	}
}