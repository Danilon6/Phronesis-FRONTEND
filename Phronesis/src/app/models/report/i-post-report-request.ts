import { IReportRequest } from "./i-report-request";

export interface IPostReportRequest extends IReportRequest{
  reportedPostId:number
}
