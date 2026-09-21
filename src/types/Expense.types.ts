import { Document, Types } from "mongoose";

export interface ISplit {
  user: Types.ObjectId;
  amountOwed: number;
}

export interface IExpense extends Document {
  groupId: Types.ObjectId;
  paidBy: Types.ObjectId;
  amount: number;
  description: string;
  splitAmong: ISplit[];
}
