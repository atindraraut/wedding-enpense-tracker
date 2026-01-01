import connectDB from '../../../lib/mongodb';
import Expense from '../../../models/Expense';
import Payment from '../../../models/Payment';

export default async function handler(req, res) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            const expenses = await Expense.find().sort({ created_at: -1 });

            // Calculate total paid and remaining for each expense
            const expensesWithPayments = await Promise.all(
                expenses.map(async (expense) => {
                    const payments = await Payment.find({ expense_id: expense._id });
                    const total_paid = payments.reduce((sum, p) => sum + p.amount, 0);
                    const remaining_amount = expense.estimated_amount - total_paid;

                    return {
                        id: expense._id,
                        event_name: expense.event_name,
                        vendor_name: expense.vendor_name,
                        estimated_amount: expense.estimated_amount,
                        notes: expense.notes,
                        created_at: expense.created_at,
                        updated_at: expense.updated_at,
                        total_paid,
                        remaining_amount
                    };
                })
            );

            res.status(200).json(expensesWithPayments);
        } else if (req.method === 'POST') {
            const { event_name, vendor_name, estimated_amount, notes } = req.body;

            if (!event_name || estimated_amount === undefined) {
                return res.status(400).json({ error: 'Event name and estimated amount required' });
            }

            const expense = await Expense.create({
                event_name,
                vendor_name: vendor_name || '',
                estimated_amount,
                notes: notes || ''
            });

            res.status(201).json({
                id: expense._id,
                ...expense.toObject()
            });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Expenses API error:', error);
        res.status(500).json({ error: error.message });
    }
}
