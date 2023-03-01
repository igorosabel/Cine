import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
  CinemasResult,
  LoginResult,
  RegisterData,
} from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { Utils } from "src/app/model/utils.class";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "app-register",
  templateUrl: "./register.component.html",
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
})
export default class RegisterComponent {
  registerData: RegisterData = {
    name: "",
    pass: "",
    conf: "",
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

    if (
      this.registerData.name === "" ||
      this.registerData.pass === "" ||
      this.registerData.conf === ""
    ) {
      return;
    }

    this.registerNameError = false;
    this.registerPassError = false;
    if (this.registerData.pass !== this.registerData.conf) {
      this.registerPassError = true;
      return;
    }

    this.registerSending = true;
    this.as
      .register(this.registerData)
      .subscribe((result: LoginResult): void => {
        this.registerSending = false;
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
          this.registerNameError = true;
        }
      });
  }
}
