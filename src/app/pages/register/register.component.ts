import { Component }          from '@angular/core';
import { Router }             from '@angular/router';
import { Cinema }             from 'src/app/model/cinema.model';
import { Utils }              from 'src/app/model/utils.class';
import { RegisterData }       from 'src/app/interfaces/interfaces';
import { ApiService }         from 'src/app/services/api.service';
import { UserService }        from 'src/app/services/user.service';
import { DataShareService }   from 'src/app/services/data-share.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: []
})
export class RegisterComponent {
	registerData: RegisterData = {
		name: '',
		pass: '',
		conf: ''
	};
	registerNameError: boolean = false;
	registerPassError: boolean = false;
	registerSending: boolean = false;

	constructor(
		private as: ApiService,
		private user: UserService,
		private dss: DataShareService,
		private router: Router,
		private cms: ClassMapperService
	) {}

	doRegister(ev: MouseEvent): void {
		ev.preventDefault();

		if (this.registerData.name==='' || this.registerData.pass==='' || this.registerData.conf==='') {
			return;
		}

		this.registerNameError = false;
		this.registerPassError = false;
		if (this.registerData.pass !== this.registerData.conf) {
			this.registerPassError = true;
			return;
		}

		this.registerSending = true;
		this.as.register(this.registerData).subscribe(result => {
			this.registerSending = false;
			if (result.status==='ok') {
				this.user.logged = true;
				this.user.id     = result.id;
				this.user.name   = Utils.urldecode(result.name);
				this.user.token  = Utils.urldecode(result.token);
				this.user.saveLogin();

				this.as.getCinemas().subscribe(result => {
					const cinemas: Cinema[] = this.cms.getCinemas(result.list);
					this.dss.setGlobal('cinemas', cinemas);
				});

				this.router.navigate(['/home']);
			}
			else {
				this.registerNameError = true;
			}
		});
	}
}
