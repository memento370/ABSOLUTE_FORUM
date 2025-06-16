import { User } from "./user";

export interface Comment {
  id?: number;
  text: string;
  creationDate: string;
  createdBy: User;
  topicId: number;
}