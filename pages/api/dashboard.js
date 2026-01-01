import connectDB from '../../lib/mongodb';
import Budget from '../../models/Budget';
import Expense from '../../models/Expense';
import Payment from '../../models/Payment';

export default async function handler(req, res) {
    try {
        await connectDB();

        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        // Get budget
        let budget = await Budget.findOne().sort({ created_at: -1 });
        if (!budget) {
            budget = await Budget.create({ total_budget: 0 });
        }
        const totalBudget = budget.total_budget;

        // Get all expenses
        const expenses = await Expense.find();
        const totalEstimate = expenses.reduce((sum, exp) => sum + exp.estimated_amount, 0);

        // Get all payments
        const payments = await Payment.find();
        const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);

        // Calculate derived values
        const totalPending = totalEstimate - totalPaid;
        const utilizedBudget = totalPaid;
        const remainingBudget = totalBudget - totalPaid;
        const exceedingEstimate = totalPaid - totalEstimate;
        const exceedingBudget = totalPaid - totalBudget;

        res.status(200).json({
            totalBudget,
            totalEstimate,
            totalPaid,
            totalPending,
            utilizedBudget,
            remainingBudget,
            exceedingEstimate: exceedingEstimate > 0 ? exceedingEstimate : 0,
            exceedingBudget: exceedingBudget > 0 ? exceedingBudget : 0,
            isOverBudget: totalPaid > totalBudget,
            isOverEstimate: totalPaid > totalEstimate
        });
    } catch (error) {
        console.error('Dashboard API error:', error);
        res.status(500).json({ error: error.message });
    }
}
