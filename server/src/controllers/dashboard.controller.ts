import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export const getInsights = async (req: Request, res: Response) => {
  try {
    const insights = await dashboardService.getInsights();
    res.json(insights);
  } catch (error: any) {
    console.error('Failed to get dashboard insights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
