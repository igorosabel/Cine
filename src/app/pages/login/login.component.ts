import { Component, OnInit }  from '@angular/core';
import { Router }             from '@angular/router';
import { Cinema }             from '../../model/cinema.model';
import { Utils }              from '../../model/utils.class';
import { ApiService }         from '../../services/api.service';
import { UserService }        from '../../services/user.service';
import { DataShareService }   from '../../services/data-share.service';
import { AuthService }        from '../../services/auth.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { LoginData }          from '../../interfaces/interfaces';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: []
})
export class LoginComponent implements OnInit {
	loginData: LoginData = {
		name: '',
		pass: ''
	};
	loginError: boolean = false;
	loginSending: boolean = false;

	constructor(
		private as: ApiService,
		private user: UserService,
		private router: Router,
		private dss: DataShareService,
		private auth: AuthService,
		private cms: ClassMapperService
	) {}

	ngOnInit(): void {
		if (this.auth.isAuthenticated()) {
			this.router.navigate(['/home']);
		}
	}

	doLogin(ev: MouseEvent): void {
		ev.preventDefault();

		if (this.loginData.name==='' || this.loginData.pass==='') {
			return;
		}

		this.loginSending = true;
		this.as.login(this.loginData).subscribe(result => {
			this.loginSending = false;
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
				this.loginError = true;
			}
		});
	}
}
