import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  CinemasResult,
  DialogOptions,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-cinemas",
  templateUrl: "./cinemas.component.html",
  imports: [CommonModule, RouterModule, MaterialModule],
  providers: [DialogService],
})
export default class CinemasComponent implements OnInit {
  cinemas: Cinema[] = [];

  constructor(
    private dss: DataShareService,
    private dialog: DialogService,
    private as: ApiService,
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.cinemas = this.dss.getGlobal("cinemas");
  }

  addCinema(): void {
    this.dialog
      .form({
        title: "Añadir cine",
        content: "Introduce el nombre del nuevo cine",
        fields: [
          {
            title: "Nombre",
            type: "text",
            value: "",
          },
        ],
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: DialogOptions): void => {
        if (result) {
          this.newCinema(result[0].value);
        }
      });
  }

  newCinema(name: string): void {
    this.as.addCinema(name).subscribe((result: StatusResult): void => {
      if (result.status == "ok") {
        this.cinemas = [];
        this.dss.removeGlobal("cinemas");

        this.getCinemas();
      } else {
        this.dialog.alert({
          title: "Error",
          content: "Ocurrió un error al guardar el nuevo cine.",
          ok: "Continuar",
        });
      }
    });
  }

  getCinemas(): void {
    this.as.getCinemas().subscribe((result: CinemasResult): void => {
      this.cinemas = this.cms.getCinemas(result.list);
      this.dss.setGlobal("cinemas", this.cinemas);
    });
  }
}
