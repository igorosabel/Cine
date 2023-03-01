import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

@NgModule({
  declarations: [],
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class MaterialModule {}
