import { Injectable } from "@angular/core";
import { LoginResult } from "src/app/interfaces/interfaces";

@Injectable()
export class UserService {
  logged: boolean = false;
  id: number = null;
  name: string = null;
  token: string = null;

  loadLogin(): void {
    const loginObj: LoginResult = JSON.parse(localStorage.getItem("login"));
    if (loginObj === null) {
      this.logout();
    } else {
      this.logged = true;
      this.id = loginObj.id;
      this.name = loginObj.name;
      this.token = loginObj.token;
    }
  }

  saveLogin(): void {
    const loginObj: LoginResult = {
      status: "ok",
      id: this.id,
      name: this.name,
      token: this.token,
    };
    localStorage.setItem("login", JSON.stringify(loginObj));
  }

  logout(): void {
    this.logged = false;
    this.id = null;
    this.name = null;
    this.token = null;
    localStorage.removeItem("login");
  }
}
