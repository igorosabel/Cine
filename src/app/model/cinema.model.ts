import { CinemaInterface } from '@interfaces/cinema.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Cinema {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public slug: string | null = null
  ) {}

  fromInterface(c: CinemaInterface): Cinema {
    this.id = c.id;
    this.name = urldecode(c.name);
    this.slug = c.slug;

    return this;
  }

  toInterface(): CinemaInterface {
    return {
      id: this.id,
      name: urlencode(this.name),
      slug: this.slug,
    };
  }
}
