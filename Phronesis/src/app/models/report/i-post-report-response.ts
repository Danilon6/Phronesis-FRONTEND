import { IPost } from "../i-post";
import { IReportResponse } from "./i-report-response";

export interface IPostReportResponse extends IReportResponse{

  reportedPost:Partial<IPost>
}
