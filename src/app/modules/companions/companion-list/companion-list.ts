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
import Companion from '@model/companion';
import { Modal, OverlayService } from '@osumi/angular-tools';
import NavigationService from '@services/navigation-service';
import AddCompanionComponent from '@shared/components/add-companion/add-companion';

@Component({
  selector: 'app-companion-list',
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
  templateUrl: './companion-list.html',
  styleUrl: './companion-list.scss',
})
export default class CompanionList implements OnInit {
  private readonly overlayService: OverlayService = inject(OverlayService);
  private readonly navigationService: NavigationService =
    inject(NavigationService);

  companions: WritableSignal<Companion[]> = signal<Companion[]>([]);

  ngOnInit(): void {
    this.companions.set(this.navigationService.getCompanions());
  }

  addCompanion(): void {
    const modalData: Modal = {
      modalTitle: `Nuevo acompañante`,
      modalColor: 'blue',
    };
    const ref = this.overlayService.open(AddCompanionComponent, modalData);
    ref.afterClosed$.subscribe((result): void => {
      if (result.data) {
        this.navigationService.addCompanion(result.data);
        this.companions.set(this.navigationService.getCompanions());
      }
    });
  }
}
