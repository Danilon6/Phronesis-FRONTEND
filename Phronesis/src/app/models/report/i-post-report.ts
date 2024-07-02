import { IPost } from "../i-post";
import { IReport } from "./i-report";

export interface IPostReport extends IReport{
  reportedPost:IPost
}
