import Expense from "../models/Expense";
import Group from "../models/Group";
import { Types } from "mongoose";
import { ISplit } from "../types/Expense.types";

export const addExpense = async (
  groupId: string,
  paidBy: string,
  amount: number,
  description: string,
  splitAmong?: { user: string; amountOwed?: number }[],
) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }

  // Ensure paidBy is in the group
  if (!group.members.some((memberId) => memberId.toString() === paidBy)) {
    throw new Error("Payer is not a member of the group");
  }

  let finalSplit: ISplit[] = [];

  if (!splitAmong || splitAmong.length === 0) {
    // If no split details provided, split equally among all group members
    const membersCount = group.members.length;
    const splitAmount = Number((amount / membersCount).toFixed(2));

    finalSplit = group.members.map((memberId) => ({
      user: memberId,
      amountOwed: splitAmount,
    }));
  } else {
    // Validate custom split
    let providedAmountsSum = 0;
    const isEqualSplitByArray = splitAmong.every(
      (s) => s.amountOwed === undefined,
    );

    if (isEqualSplitByArray) {
      // Split equally among the provided subset of members
      const splitAmount = Number((amount / splitAmong.length).toFixed(2));
      finalSplit = splitAmong.map((s) => ({
        user: new Types.ObjectId(s.user),
        amountOwed: splitAmount,
      }));
    } else {
      // Exact amounts provided
      finalSplit = splitAmong.map((s) => {
        if (s.amountOwed === undefined) {
          throw new Error(
            "If providing unequal split, all users must have amountOwed specified",
          );
        }
        providedAmountsSum += s.amountOwed;
        return {
          user: new Types.ObjectId(s.user),
          amountOwed: s.amountOwed,
        };
      });

      // Basic float validation to prevent rounding errors rejecting valid inputs
      if (Math.abs(providedAmountsSum - amount) > 0.01) {
        throw new Error(
          `Total split amounts (${providedAmountsSum}) do not match the total expense amount (${amount})`,
        );
      }
    }
  }

  const expense = await Expense.create({
    groupId: new Types.ObjectId(groupId),
    paidBy: new Types.ObjectId(paidBy),
    amount,
    description,
    splitAmong: finalSplit,
  });

  return expense;
};

export const getGroupSummary = async (
  groupId: string,
): Promise<Record<string, { balance: number; name: string }>> => {
  const expenses = await Expense.find({ groupId: new Types.ObjectId(groupId) });

  const balances: Record<string, number> = {};
  const names: Record<string, string> = {};

  // Initialize group members balances to 0 if needed (optional, depends on if we want members with 0 balance shown)
  const group = await Group.findById(groupId).populate("members", "name");
  if (group) {
    group.members.forEach((m: any) => {
      balances[m._id.toString()] = 0;
      names[m._id.toString()] = m.name;
    });
  }

  expenses.forEach((exp) => {
    const payerStr = exp.paidBy.toString();

    // Add full amount to the payer's positive balance
    if (balances[payerStr] === undefined) balances[payerStr] = 0;
    balances[payerStr] += exp.amount;

    // Subtract each person's owed amount
    exp.splitAmong.forEach((split) => {
      const userStr = split.user.toString();
      if (balances[userStr] === undefined) balances[userStr] = 0;
      balances[userStr] -= split.amountOwed;
    });
  });

  const result: Record<string, { balance: number; name: string }> = {};
  // Fix floating point precision
  for (const user in balances) {
    result[user] = {
      balance: Number(balances[user].toFixed(2)),
      name: names[user] || "Unknown User",
    };
  }

  return result;
};
