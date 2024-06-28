import { IUserPostInteraction } from "./i-user-post-interaction";

export interface IComment extends IUserPostInteraction {
  content: string;
}
