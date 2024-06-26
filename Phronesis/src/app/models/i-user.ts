import { IRole } from "./i-role";

export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: String; // Campo opzionale con immagine default
  bio?: string; // Campo opzionale
  roles: IRole[];
  enabled: boolean;
  banned: boolean;
}
