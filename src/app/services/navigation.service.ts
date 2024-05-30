import { Injectable, inject } from '@angular/core';
import { CinemaInterface, NavigationFromType } from '@interfaces/interfaces';
import Cinema from '@model/cinema.model';
import ClassMapperService from '@services/class-mapper.service';

@Injectable({
  providedIn: 'root',
})
export default class NavigationService {
  private cms: ClassMapperService = inject(ClassMapperService);

  private from: NavigationFromType[] = [];
  private cinemas: Cinema[] = [];
  private cinemasLoaded: boolean = false;

  get(): NavigationFromType {
    if (this.from.length > 0) {
      const elem: NavigationFromType | undefined = this.from.pop();
      if (elem !== undefined) {
        return elem;
      }
    }
    return [];
  }

  getLast(): NavigationFromType {
    if (this.from.length > 0) {
      return this.from[this.from.length - 1];
    }
    return [];
  }

  add(item: NavigationFromType): void {
    this.from.push(item);
  }

  set(item: NavigationFromType): void {
    this.from = [item];
  }

  getCinemas(): Cinema[] {
    if (!this.cinemasLoaded) {
      this.loadCinemas();
    }
    return this.cinemas;
  }

  loadCinemas(): void {
    const cinemasObjStr: string | null = localStorage.getItem('cinemas');
    if (cinemasObjStr !== null) {
      const cinemasObj: CinemaInterface[] = JSON.parse(cinemasObjStr);
      if (cinemasObj !== null) {
        this.setCinemas(this.cms.getCinemas(cinemasObj), false);
        this.cinemasLoaded = true;
      }
    }
  }

  setCinemas(cinemas: Cinema[], save: boolean = true): void {
    this.cinemas = cinemas;
    const cinemasObj: CinemaInterface[] = cinemas.map(
      (c: Cinema): CinemaInterface => {
        return c.toInterface();
      }
    );
    localStorage.setItem('cinemas', JSON.stringify(cinemasObj));
  }

  getCinema(id: number): Cinema | null {
    if (!this.cinemasLoaded) {
      this.loadCinemas();
    }
    const cinemaInd: number = this.cinemas.findIndex(
      (x: Cinema): boolean => x.id === parseInt(id.toString())
    );
    if (cinemaInd !== -1) {
      return this.cinemas[cinemaInd];
    }
    return null;
  }

  updateCinema(cinema: Cinema): void {
    const ind: number = this.cinemas.findIndex(
      (x: Cinema): boolean => x.id === cinema.id
    );
    if (ind !== -1) {
      this.cinemas[ind] = cinema;
    } else {
      this.cinemas.push(cinema);
    }
  }
}
