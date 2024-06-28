import { IBaseEntity } from "./i-base-entity";
import { IPost } from "./i-post";
import { IUser } from "./i-user";

export interface IUserPostInteraction extends IBaseEntity {
  user: IUser;
  post: IPost;
}
