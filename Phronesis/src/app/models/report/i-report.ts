import { IBaseEntity } from "../i-base-entity";
import { IUser } from "../i-user";

export interface IReport extends IBaseEntity{
  reportedBy:IUser
  reason:string
}
