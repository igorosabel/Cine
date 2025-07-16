import { Pipe, PipeTransform, inject } from '@angular/core';
import Cinema from '@model/cinema';
import NavigationService from '@services/navigation-service';

@Pipe({
  name: 'cinemaName',
})
export default class CinemaNamePipe implements PipeTransform {
  private navigationService: NavigationService = inject(NavigationService);

  transform(id: number | null): string | null {
    if (id === null) {
      return null;
    }
    const cinema: Cinema | null = this.navigationService.getCinema(id);
    return cinema !== null ? cinema.name : null;
  }
}
