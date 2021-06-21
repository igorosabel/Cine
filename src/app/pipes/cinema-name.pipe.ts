import { Pipe, PipeTransform } from '@angular/core';
import { DataShareService }    from '../services/data-share.service';

@Pipe({
  name: 'cinemaName'
})
export class CinemaNamePipe implements PipeTransform {

	constructor(private dss: DataShareService) { }

	transform(id: number): string {
		const cinemas = this.dss.getGlobal('cinemas');
		const ind = cinemas.findIndex(x => x.id===id);
		return (ind!=-1) ? cinemas[ind].name : '';
	}

}
