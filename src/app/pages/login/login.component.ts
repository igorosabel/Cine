import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { LoginData, Cinema } from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { UserService }       from '../../services/user.service';
import { CommonService }     from '../../services/common.service';
import { DataShareService }  from '../../services/data-share.service';

@Component({
  selector: 'app-login',
  templateUrl: './html/login.component.html',
  styleUrls: ['./css/login.component.css']
})
export class LoginComponent implements OnInit {
	loginData = {
		name: '',
		pass: ''
	} as LoginData;
	loginError: boolean = false;
	loginSending: boolean = false;

	constructor(private as: ApiService,
	            private user: UserService,
				private cs: CommonService,
				private router: Router,
				private dss: DataShareService) {}
	ngOnInit() {}
	
	doLogin(ev) {
		ev.preventDefault();
		
		if (this.loginData.name==='' || this.loginData.pass===''){
			return false;
		}
		
		this.loginSending = true;
		this.as.login(this.loginData).subscribe(result => {
			this.loginSending = false;
			if (result.status==='ok'){
				this.user.logged = true;
				this.user.id     = result.id;
				this.user.name   = this.cs.urldecode(result.name);
				this.user.token  = this.cs.urldecode(result.token);
				this.user.saveLogin();
				
				this.as.getCinemas().subscribe(result => {
					const cinemas: Cinema[] = result.list;
					this.dss.setGlobal('cinemas', cinemas);
				});
				
				this.router.navigate(['/home']);
			}
			else{
				this.loginError = true;
			}
		});
	}
}