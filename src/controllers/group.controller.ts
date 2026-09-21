import { Request, Response } from 'express';
import Group from '../models/Group';
import * as expenseService from '../services/expense.service';
import * as settlementService from '../services/settlement.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { name, members } = req.body;
    
    // Ensure the creator is in the members list if not already
    const memberSet = new Set(members);
    if (req.user) {
      memberSet.add(req.user.id.toString());
    }

    const group = await Group.create({
      name,
      members: Array.from(memberSet)
    });

    res.status(201).json({ success: true, message: 'Group created successfully', data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id: groupId } = req.params;
    const { paidBy, amount, description, splitAmong } = req.body;

    const expense = await expenseService.addExpense(groupId, paidBy, amount, description, splitAmong);

    res.status(201).json({ success: true, message: 'Expense added successfully', data: expense });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGroupSummary = async (req: Request, res: Response) => {
  try {
    const { id: groupId } = req.params;
    const balances = await expenseService.getGroupSummary(groupId);

    res.status(200).json({ success: true, message: 'Group summary fetched successfully', data: balances });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSettlements = async (req: Request, res: Response) => {
  try {
    const { id: groupId } = req.params;
    const settlements = await settlementService.calculateSettlements(groupId);

    res.status(200).json({ success: true, message: 'Settlements calculated successfully', data: settlements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
