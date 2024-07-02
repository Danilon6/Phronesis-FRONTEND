import { IBaseEntity } from "./i-base-entity";
import { RoleType } from "./role-type";

export interface IRole extends IBaseEntity{
  roleType: RoleType;
}
