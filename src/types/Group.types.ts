import { Document, Types } from "mongoose";

export interface IGroup extends Document {
  name: string;
  members: Types.ObjectId[];
}