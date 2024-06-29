import {IApiProfile} from "./user";

export type candidatesResponseAPI = {
  content: IApiProfile[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  message?: string;
}
