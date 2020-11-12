import { Component, OnInit }  from '@angular/core';
import { Cinema }             from '../../model/cinema.model';
import { DataShareService }   from '../../services/data-share.service';
import { DialogService }      from '../../services/dialog.service';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';

@Component({
	selector: 'app-cinemas',
	templateUrl: './cinemas.component.html',
	styleUrls: []
})
export class CinemasComponent implements OnInit {
	cinemas: Cinema[] = [];

	constructor(
		private dss: DataShareService,
		private dialog: DialogService,
		private as: ApiService,
		private cms: ClassMapperService
	) {}

	ngOnInit() {
		this.cinemas = this.dss.getGlobal('cinemas');
	}
	
	addCinema() {
		this.dialog.form({
			title: 'Añadir cine',
			content: 'Introduce el nombre del nuevo cine',
			fields: [
				{
					title: 'Nombre',
					type: 'text',
					value: ''
				}
			],
			ok: 'Continuar',
			cancel: 'Cancelar'
		})
		.subscribe(result => {
			if (result) {
				this.newCinema(result[0].value);
			}
		});
	}
	
	newCinema(name: string) {
		this.as.addCinema(name).subscribe(result => {
			if (result.status=='ok'){
				this.cinemas = [];
				this.dss.removeGlobal('cinemas');

				this.getCinemas();
			}
			else {
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al guardar el nuevo cine.', ok: 'Continuar'});
			}
		});
	}
	
	getCinemas() {
		this.as.getCinemas().subscribe(result => {
			this.cinemas = this.cms.getCinemas(result.list);
			this.dss.setGlobal('cinemas', this.cinemas);
		});
	}
}