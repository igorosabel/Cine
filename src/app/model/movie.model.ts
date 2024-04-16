import { MovieInterface } from "@interfaces/interfaces";
import { Utils } from "@model/utils.class";

export class Movie {
  coverStatus: number;
  ticketStatus: number;

  constructor(
    public id: number = null,
    public idCinema: number = null,
    public name: string = null,
    public slug: string = null,
    public cover: string = null,
    public ticket: string = null,
    public imdbUrl: string = null,
    public date: string = null
  ) {
    this.coverStatus = 0;
    this.ticketStatus = 0;
  }

  fromInterface(m: MovieInterface): Movie {
    this.id = m.id;
    this.idCinema = m.idCinema;
    this.name = Utils.urldecode(m.name);
    this.slug = m.slug;
    this.cover = Utils.urldecode(m.cover);
    this.ticket = Utils.urldecode(m.ticket);
    this.imdbUrl = Utils.urldecode(m.imdbUrl);
    this.date = Utils.urldecode(m.date);

    return this;
  }

  toInterface(): MovieInterface {
    return {
      id: this.id,
      idCinema: this.idCinema,
      name: Utils.urlencode(this.name),
      slug: this.slug,
      cover: Utils.urlencode(this.cover),
      coverStatus: this.coverStatus,
      ticket: Utils.urlencode(this.ticket),
      ticketStatus: this.ticketStatus,
      imdbUrl: Utils.urlencode(this.imdbUrl),
      date: Utils.urlencode(this.date),
    };
  }
}
