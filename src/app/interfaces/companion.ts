export interface CompanionInterface {
  id: number | null;
  idUser: number | null;
  name: string | null;
  username: string | null;
}

export interface CompanionsResult {
  status: string;
  list: CompanionInterface[];
}

export interface CompanionSaveResult {
  status: string;
  companion: CompanionInterface;
}
