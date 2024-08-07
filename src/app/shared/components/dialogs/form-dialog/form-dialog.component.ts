import { Component, WritableSignal, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DialogField } from "@interfaces/interfaces";

@Component({
  standalone: true,
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export default class FormDialogComponent {
  public dialogRef: MatDialogRef<FormDialogComponent> = inject(
    MatDialogRef<FormDialogComponent>
  );

  public title: WritableSignal<string> = signal<string>("");
  public content: WritableSignal<string> = signal<string>("");
  public fields: WritableSignal<DialogField[]> = signal<DialogField[]>([]);
  public ok: WritableSignal<string> = signal<string>("Continuar");
  public cancel: WritableSignal<string> = signal<string>("Cancelar");
}
