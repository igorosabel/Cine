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
import Companion from '@model/companion.model';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';

@Component({
  selector: 'app-add-companion',
  imports: [MatFormField, MatLabel, MatInput, MatButton, FormsModule],
  templateUrl: './add-companion.component.html',
  styleUrl: './add-companion.component.scss',
})
export default class AddCompanionComponent implements OnInit {
  private customOverlayRef: CustomOverlayRef<null> = inject(
    CustomOverlayRef<null>
  );
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);

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

    this.as.saveCompanion(this.companion.toInterface()).subscribe((result) => {
      if (result.status === 'ok') {
        this.customOverlayRef.close(this.cms.getCompanion(result.companion));
      } else {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al guardar el acompañante.',
        });
      }
    });
  }
}
