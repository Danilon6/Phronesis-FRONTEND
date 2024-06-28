import { IBaseEntity } from "./i-base-entity";
import { IComment } from "./i-comment";
import { ILike } from "./i-like";
import { IUser } from "./i-user";

export interface IPost extends IBaseEntity {
  title: string;
  content: string;
  user: IUser;
  comments: IComment[];
  likes: ILike[];
}
