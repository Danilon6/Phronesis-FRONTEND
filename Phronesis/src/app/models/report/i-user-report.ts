import { IReport } from "./i-report";
import { IUser } from "../i-user";

export interface IUserReport extends IReport{
  reportedUser:IUser
}
