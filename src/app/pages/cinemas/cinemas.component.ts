import { Component, OnInit } from '@angular/core';
import { Cinema }            from '../../interfaces/interfaces';
import { DataShareService }  from '../../services/data-share.service';

@Component({
  selector: 'app-cinemas',
  templateUrl: './html/cinemas.component.html',
  styleUrls: ['./css/cinemas.component.css']
})
export class CinemasComponent implements OnInit {
	cinemas: Cinema[] = [];

	constructor(private dss: DataShareService) {}

	ngOnInit() {
		this.cinemas = this.dss.getGlobal('cinemas');
	}
}