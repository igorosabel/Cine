import { CompanionInterface } from '@interfaces/companion.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Companion {
  constructor(
    public id: number | null = null,
    public idUser: number | null = null,
    public name: string | null = null,
    public username: string | null = null
  ) {}

  fromInterface(c: CompanionInterface): Companion {
    this.id = c.id;
    this.idUser = c.idUser;
    this.name = urldecode(c.name);
    this.username = urldecode(c.username);

    return this;
  }

  toInterface(): CompanionInterface {
    return {
      id: this.id,
      idUser: this.idUser,
      name: urlencode(this.name),
      username: urlencode(this.username),
    };
  }
}
