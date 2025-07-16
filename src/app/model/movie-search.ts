import { MovieSearchDetailResult, MovieSearchResult } from '@interfaces/movie';
import { urldecode, urlencode } from '@osumi/tools';

export default class MovieSearch {
  constructor(
    public status: string = '',
    public id: number = 0,
    public title: string | null = '',
    public poster: string | null = '',
    public imdbUrl: string | null = null
  ) {}

  fromInterface(
    status: string,
    msr: MovieSearchResult,
    imdbUrl: string
  ): MovieSearch {
    this.status = status;
    this.id = msr.id;
    this.title = urldecode(msr.title);
    this.poster = urldecode(msr.poster);
    this.imdbUrl = imdbUrl ? urldecode(imdbUrl) : null;

    return this;
  }

  toDetailInterface(): MovieSearchDetailResult {
    return {
      status: this.status,
      title: urlencode(this.title),
      poster: urlencode(this.poster),
      imdbUrl: this.imdbUrl ? urlencode(this.imdbUrl) : null,
    };
  }

  toSearchInterface(): MovieSearchResult {
    return {
      id: this.id,
      title: urlencode(this.title),
      poster: urlencode(this.poster),
    };
  }
}
