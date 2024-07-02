import { IUser } from "../i-user";

export interface IReportResponse {

  id:number
  createdAt:Date
  updatedAt:Date
  reportedBy:Partial<IUser>
  reason:string
}
