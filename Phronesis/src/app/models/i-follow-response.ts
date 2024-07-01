import { IUser } from './i-user';
export interface IFollowResponse {
  follower: Partial<IUser>
  following: Partial<IUser>
}
