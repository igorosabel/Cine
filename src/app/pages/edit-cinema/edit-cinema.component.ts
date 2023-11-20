import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { CinemasResult, StatusResult } from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-edit-cinema",
  templateUrl: "./edit-cinema.component.html",
  imports: [
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export default class EditCinemaComponent implements OnInit {
  cinemas: Cinema[] = [];
  selectedIndex: number = null;
  selectedCinema: Cinema = null;
  editSending: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dss: DataShareService,
    private router: Router,
    private dialog: DialogService,
    private as: ApiService,
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.cinemas = this.dss.getGlobal("cinemas");
    if (this.cinemas.length == 0) {
      this.router.navigate(["/cinemas"]);
    }
    this.activatedRoute.params.subscribe((params: Params): void => {
      const id: number = params.id;
      this.selectedIndex = this.cinemas.findIndex(
        (x: Cinema): boolean => x.id == id
      );
      this.selectedCinema = this.cinemas[this.selectedIndex];
    });
  }

  doEdit(ev: MouseEvent): void {
    ev.preventDefault();
    if (this.selectedCinema.name == "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No puedes dejar el nombre en blanco!",
        ok: "Continuar",
      });
      return;
    }

    this.as
      .editCinema(this.selectedCinema)
      .subscribe((result: StatusResult): void => {
        if (result.status == "ok") {
          this.cinemas[this.selectedIndex].name = this.selectedCinema.name;
          this.dss.setGlobal("cinemas", this.cinemas);
          this.dialog.alert({
            title: "Cine actualizado",
            content: "El nombre del cine ha sido actualizado.",
            ok: "Continuar",
          });
        }
      });
  }

  deleteCinema(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.dialog
      .confirm({
        title: "Borrar cine",
        content:
          "¿Estás seguro de querer borrar este cine? También se borrarán todas sus entradas.",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result) {
          this.deleteCinemaConfirm();
        }
      });
  }

  deleteCinemaConfirm(): void {
    this.as
      .deleteCinema(this.selectedCinema.id)
      .subscribe((result: StatusResult): void => {
        if (result.status == "ok") {
          this.dialog
            .alert({
              title: "Cine borrado",
              content: "El cine y todas sus entradas han sido borradas.",
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {
              this.dss.removeGlobal("cinemas");
              this.getCinemas();
            });
        }
      });
  }

  getCinemas(): void {
    this.as.getCinemas().subscribe((result: CinemasResult): void => {
      this.cinemas = this.cms.getCinemas(result.list);
      this.dss.setGlobal("cinemas", this.cinemas);
      this.router.navigate(["/cinemas"]);
    });
  }
}
