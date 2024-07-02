import { IReportRequest } from "./i-report-request";

export interface IUserReportRequest extends IReportRequest{

  reportedUserId:number
}
