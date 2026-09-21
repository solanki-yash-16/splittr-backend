import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    // Exclude passwordHash from the response
    const users = await User.find({}, '-passwordHash');
    
    res.status(200).json({ 
      success: true, 
      message: 'Users fetched successfully',
      data: users 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
