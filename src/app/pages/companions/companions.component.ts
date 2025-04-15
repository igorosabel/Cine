import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemIcon,
  MatNavList,
} from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import Companion from '@model/companion.model';
import { Modal, OverlayService } from '@osumi/angular-tools';
import NavigationService from '@services/navigation.service';
import AddCompanionComponent from '@shared/components/add-companion/add-companion.component';

@Component({
  selector: 'app-companions',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatIcon,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatFabButton,
    RouterLink,
  ],
  templateUrl: './companions.component.html',
  styleUrl: './companions.component.scss',
})
export default class CompanionsComponent implements OnInit {
  private ns: NavigationService = inject(NavigationService);
  private os: OverlayService = inject(OverlayService);

  companions: WritableSignal<Companion[]> = signal<Companion[]>([]);

  ngOnInit(): void {
    this.companions.set(this.ns.getCompanions());
  }

  addCompanion(): void {
    const modalData: Modal = {
      modalTitle: `Nuevo acompañante`,
      modalColor: 'blue',
    };
    const ref = this.os.open(AddCompanionComponent, modalData);
    ref.afterClosed$.subscribe((result): void => {
      if (result.data) {
        this.ns.addCompanion(result.data);
        this.companions.set(this.ns.getCompanions());
      }
    });
  }
}
