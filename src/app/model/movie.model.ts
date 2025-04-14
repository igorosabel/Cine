import { CompanionInterface } from '@interfaces/companion.interfaces';
import { MovieInterface } from '@interfaces/movie.interfaces';
import { urldecode, urlencode } from '@osumi/tools';
import Companion from './companion.model';

export default class Movie {
  coverStatus: number = 0;
  ticketStatus: number = 0;
  companionIds: number[] = [];

  constructor(
    public id: number | null = null,
    public idCinema: number | null = null,
    public name: string | null = null,
    public slug: string | null = null,
    public cover: string | null = null,
    public ticket: string | null = null,
    public imdbUrl: string | null = null,
    public date: string | null = null,
    public companions: Companion[] = []
  ) {}

  fromInterface(m: MovieInterface): Movie {
    this.id = m.id;
    this.idCinema = m.idCinema;
    this.name = urldecode(m.name);
    this.slug = m.slug;
    this.cover = urldecode(m.cover);
    this.ticket = urldecode(m.ticket);
    this.imdbUrl = urldecode(m.imdbUrl);
    this.date = urldecode(m.date);
    this.companions = m.companions.map(
      (c: CompanionInterface): Companion => new Companion().fromInterface(c)
    );

    return this;
  }

  toInterface(): MovieInterface {
    return {
      id: this.id,
      idCinema: this.idCinema,
      name: urlencode(this.name),
      slug: this.slug,
      cover: urlencode(this.cover),
      coverStatus: this.coverStatus,
      ticket: urlencode(this.ticket),
      ticketStatus: this.ticketStatus,
      imdbUrl: urlencode(this.imdbUrl),
      date: urlencode(this.date),
      companions: this.companions.map(
        (c: Companion): CompanionInterface => c.toInterface()
      ),
    };
  }
}
