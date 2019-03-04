import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { RegisterData }      from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { UserService }       from '../../services/user.service';
import { CommonService }     from '../../services/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './html/register.component.html',
  styleUrls: ['./css/register.component.css']
})
export class RegisterComponent implements OnInit {
	registerData = {
		name: '',
		pass: '',
		conf: ''
	} as RegisterData;
	registerNameError: boolean = false;
	registerPassError: boolean = false;
	registerSending: boolean = false;

	constructor(private as: ApiService, private user: UserService, private cs: CommonService, private router: Router) {}
	ngOnInit() {}
	
	doRegister(ev) {
		ev.preventDefault();
		
		if (this.registerData.name==='' || this.registerData.pass==='' || this.registerData.conf===''){
			return false;
		}
		
		this.registerNameError = false;
		this.registerPassError = false;
		if (this.registerData.pass !== this.registerData.conf){
			this.registerPassError = true;
			return false;
		}
		
		this.registerSending = true;
		this.as.register(this.registerData).subscribe(result => {
			this.registerSending = false;
			if (result.status==='ok'){
				this.user.logged = true;
				this.user.id     = result.id;
				this.user.name   = this.cs.urldecode(result.name);
				this.user.token  = this.cs.urldecode(result.token);
				this.user.saveLogin();
				
				this.router.navigate(['/home']);
			}
			else{
				this.registerNameError = true;
			}
		});
	}
}