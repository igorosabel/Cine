import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CompanionSaveResult } from '@interfaces/companion';
import Companion from '@model/companion';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api-service';
import ClassMapperService from '@services/class-mapper-service';

@Component({
  selector: 'app-add-companion',
  imports: [MatFormField, MatLabel, MatInput, MatButton, FormsModule],
  templateUrl: './add-companion.html',
  styleUrl: './add-companion.scss',
})
export default class AddCompanion implements OnInit {
  private readonly customOverlayRef: CustomOverlayRef<null> = inject(
    CustomOverlayRef<null>
  );
  private readonly dialog: DialogService = inject(DialogService);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService =
    inject(ClassMapperService);

  companion: Companion = new Companion();
  nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');

  ngOnInit(): void {
    this.nameBox().nativeElement.focus();
  }

  saveCompanion(): void {
    if (this.companion.name === null || this.companion.name === '') {
      this.dialog
        .alert({
          title: 'Error',
          content: 'El nombre es obligatorio.',
        })
        .subscribe(() => {
          this.nameBox().nativeElement.focus();
          return;
        });
    }

    this.apiService.saveCompanion(this.companion.toInterface()).subscribe({
      next: (result: CompanionSaveResult): void => {
        if (result.status === 'ok') {
          this.customOverlayRef.close(
            this.classMapperService.getCompanion(result.companion)
          );
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al guardar el acompañante.',
          });
        }
      },
      error: (err: Error): void => {
        this.dialog.alert({
          title: 'Error',
          content: `Ocurrió un error al guardar el acompañante: ${err.message}`,
        });
      },
    });
  }
}
