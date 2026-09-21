import { Transaction } from "../types/Settlement.types";
import { getGroupSummary } from "./expense.service";

export const calculateSettlements = async (
  groupId: string,
): Promise<Transaction[]> => {
  const balances = await getGroupSummary(groupId);

  const debtors: { user: string; name: string; amount: number }[] = [];
  const creditors: { user: string; name: string; amount: number }[] = [];

  for (const [user, data] of Object.entries(balances)) {
    if (data.balance < 0) {
      debtors.push({ user, name: data.name, amount: Math.abs(data.balance) });
    } else if (data.balance > 0) {
      creditors.push({ user, name: data.name, amount: data.balance });
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
      fromName: debtor.name,
      to: creditor.user,
      toName: creditor.name,
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
