import mongoose, { Schema, Document, Types } from "mongoose";
import { IExpense } from "../types/Expense.types";

const ExpenseSchema: Schema = new Schema(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    splitAmong: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amountOwed: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
