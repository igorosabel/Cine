export interface LoginData {
  name: string;
  pass: string;
}

export interface LoginResult {
  status: string;
  id: number | null;
  name: string | null;
  token: string | null;
}

export interface RegisterData {
  name: string;
  pass: string;
  conf: string;
}

export interface StatusResult {
  status: string;
}

export type NavigationFromType = (string | number | null)[];
