import { IUser } from "../i-user";
import { IReportResponse } from "./i-report-response";

export interface IUserReportResponse extends IReportResponse{

  reportedUser:Partial<IUser>
}
