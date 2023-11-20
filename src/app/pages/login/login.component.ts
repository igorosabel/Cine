import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import {
  CinemasResult,
  LoginData,
  LoginResult,
} from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { Utils } from "src/app/model/utils.class";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class LoginComponent implements OnInit {
  loginData: LoginData = {
    name: "",
    pass: "",
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
      this.router.navigate(["/home"]);
    }
  }

  doLogin(ev: MouseEvent): void {
    ev.preventDefault();

    if (this.loginData.name === "" || this.loginData.pass === "") {
      return;
    }

    this.loginSending = true;
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      this.loginSending = false;
      if (result.status === "ok") {
        this.user.logged = true;
        this.user.id = result.id;
        this.user.name = Utils.urldecode(result.name);
        this.user.token = Utils.urldecode(result.token);
        this.user.saveLogin();

        this.as.getCinemas().subscribe((result: CinemasResult): void => {
          const cinemas: Cinema[] = this.cms.getCinemas(result.list);
          this.dss.setGlobal("cinemas", cinemas);
        });

        this.router.navigate(["/home"]);
      } else {
        this.loginError = true;
      }
    });
  }
}
