import { Component, WritableSignal, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "app-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  imports: [MatDialogModule, MatButtonModule],
})
export default class AlertDialogComponent {
  public title: WritableSignal<string> = signal<string>("");
  public content: WritableSignal<string> = signal<string>("");
  public ok: WritableSignal<string> = signal<string>("Continuar");

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>) {}
}
