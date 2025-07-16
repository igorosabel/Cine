import { Injectable, inject } from '@angular/core';
import { CinemaInterface } from '@interfaces/cinema';
import { CompanionInterface } from '@interfaces/companion';
import { NavigationFromType } from '@interfaces/interfaces';
import Cinema from '@model/cinema';
import Companion from '@model/companion';
import ClassMapperService from '@services/class-mapper-service';

@Injectable({
  providedIn: 'root',
})
export default class NavigationService {
  private classMapperService: ClassMapperService = inject(ClassMapperService);

  private from: NavigationFromType[] = [];
  private cinemas: Cinema[] = [];
  private cinemasLoaded: boolean = false;
  private companions: Companion[] = [];
  private companionsLoaded: boolean = false;

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
        this.setCinemas(this.classMapperService.getCinemas(cinemasObj), false);
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
    if (save) {
      localStorage.setItem('cinemas', JSON.stringify(cinemasObj));
    }
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

  getCompanions(): Companion[] {
    if (!this.companionsLoaded) {
      this.loadCompanions();
    }
    return this.companions;
  }

  getCompanion(id: number): Companion | undefined {
    if (!this.companionsLoaded) {
      this.loadCompanions();
    }
    return this.companions.find((x: Companion): boolean => x.id === id);
  }

  addCompanion(companion: Companion): void {
    if (!this.companionsLoaded) {
      this.loadCompanions();
    }
    this.companions.push(companion);
    this.setCompanions(this.companions);
  }

  loadCompanions(): void {
    const companionsObjStr: string | null = localStorage.getItem('companions');
    if (companionsObjStr !== null) {
      const companionsObj: CompanionInterface[] = JSON.parse(companionsObjStr);
      if (companionsObj !== null) {
        this.setCompanions(
          this.classMapperService.getCompanions(companionsObj),
          false
        );
        this.companionsLoaded = true;
      }
    }
  }

  setCompanions(companions: Companion[], save: boolean = true): void {
    this.companions = companions;
    const companionsObj: CompanionInterface[] = companions.map(
      (c: Companion): CompanionInterface => {
        return c.toInterface();
      }
    );
    if (save) {
      localStorage.setItem('companions', JSON.stringify(companionsObj));
    }
  }
}
