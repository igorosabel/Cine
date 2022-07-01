import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Cinema }                        from 'src/app/model/cinema.model';
import { DataShareService }              from 'src/app/services/data-share.service';
import { DialogService }                 from 'src/app/services/dialog.service';
import { ApiService }                    from 'src/app/services/api.service';
import { ClassMapperService }            from 'src/app/services/class-mapper.service';

@Component({
	selector: 'app-edit-cinema',
	templateUrl: './edit-cinema.component.html',
	styleUrls: []
})
export class EditCinemaComponent implements OnInit {
	cinemas: Cinema[]      = [];
	selectedIndex: number  = null;
	selectedCinema: Cinema = null;
	editSending: boolean   = false;

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
			this.router.navigate(['/cinemas']);
		}
		this.activatedRoute.params.subscribe((params: Params) => {
			const id: number = params.id;
			this.selectedIndex = this.cinemas.findIndex(x => x.id==id);
			this.selectedCinema = this.cinemas[this.selectedIndex];
		});
	}

	doEdit(ev: MouseEvent): void {
		ev.preventDefault();
		if (this.selectedCinema.name==''){
			this.dialog.alert({title: 'Error', content: '¡No puedes dejar el nombre en blanco!', ok: 'Continuar'});
			return;
		}

		this.as.editCinema(this.selectedCinema).subscribe(result => {
			if (result.status=='ok') {
				this.cinemas[this.selectedIndex].name = this.selectedCinema.name;
				this.dss.setGlobal('cinemas', this.cinemas);
				this.dialog.alert({title: 'Cine actualizado', content: 'El nombre del cine ha sido actualizado.', ok: 'Continuar'});
			}
		});
	}

	deleteCinema(ev: MouseEvent): void {
		ev.preventDefault();
		ev.stopPropagation();
		this.dialog.confirm({title: 'Borrar cine',
    	                     content: '¿Estás seguro de querer borrar este cine? También se borrarán todas sus entradas.',
    	                     ok: 'Continuar',
    	                     cancel: 'Cancelar'}).subscribe(result => {
			if (result) {
				this.deleteCinemaConfirm();
			}
		});
	}

	deleteCinemaConfirm(): void {
		this.as.deleteCinema(this.selectedCinema.id).subscribe(result => {
			if (result.status=='ok') {
				this.dialog.alert({title: 'Cine borrado', content: 'El cine y todas sus entradas han sido borradas.', ok: 'Continuar'}).subscribe(result => {
					this.dss.removeGlobal('cinemas');
					this.getCinemas();
				});
			}
		});
	}

	getCinemas(): void {
		this.as.getCinemas().subscribe(result => {
			this.cinemas = this.cms.getCinemas(result.list);
			this.dss.setGlobal('cinemas', this.cinemas);
			this.router.navigate(['/cinemas']);
		});
	}
}
