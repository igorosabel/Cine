import { Pipe, PipeTransform } from "@angular/core";
import { Cinema } from "src/app/model/cinema.model";
import { DataShareService } from "src/app/services/data-share.service";

@Pipe({
  standalone: true,
  name: "cinemaName",
})
export class CinemaNamePipe implements PipeTransform {
  constructor(private dss: DataShareService) {}

  transform(id: number): string {
    const cinemas: Cinema[] = this.dss.getGlobal("cinemas");
    const ind: number = cinemas.findIndex((x: Cinema): boolean => x.id === id);
    return ind != -1 ? cinemas[ind].name : "";
  }
}
