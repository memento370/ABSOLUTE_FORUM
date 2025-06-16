import { Comment } from "./comment";
import { User } from "./user";

export interface Topic {
  id: number;
  status: string;
  createdBy: User;            
  creationDate: Date;
  title: string;
  message: string;
  subSection: string;
  comments: Comment[];      
}