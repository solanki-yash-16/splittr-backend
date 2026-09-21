import { Transaction } from "../types/Settlement.types";
import { getGroupSummary } from "./expense.service";

export const calculateSettlements = async (
  groupId: string,
): Promise<Transaction[]> => {
  const balances = await getGroupSummary(groupId);

  const debtors: { user: string; amount: number }[] = [];
  const creditors: { user: string; amount: number }[] = [];

  for (const [user, amount] of Object.entries(balances)) {
    if (amount < 0) {
      debtors.push({ user, amount: Math.abs(amount) });
    } else if (amount > 0) {
      creditors.push({ user, amount });
    }
  }

  // Sort by highest amount first for a greedy approach
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions: Transaction[] = [];
  let i = 0; // index for debtors
  let j = 0; // index for creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const minAmount = Math.min(debtor.amount, creditor.amount);

    // Create transaction
    transactions.push({
      from: debtor.user,
      to: creditor.user,
      amount: Number(minAmount.toFixed(2)),
    });

    // Update balances
    debtor.amount = Number((debtor.amount - minAmount).toFixed(2));
    creditor.amount = Number((creditor.amount - minAmount).toFixed(2));

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return transactions;
};
