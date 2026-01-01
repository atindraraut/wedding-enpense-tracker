import connectDB from '../../../lib/mongodb';
import Payment from '../../../models/Payment';
import Expense from '../../../models/Expense';

export default async function handler(req, res) {
    try {
        await connectDB();

        if (req.method === 'POST') {
            const { expense_id, amount, payment_date, notes } = req.body;

            if (!expense_id || !amount || amount <= 0) {
                return res.status(400).json({ error: 'Expense ID and valid amount required' });
            }

            // Verify expense exists
            const expense = await Expense.findById(expense_id);
            if (!expense) {
                return res.status(404).json({ error: 'Expense not found' });
            }

            const payment = await Payment.create({
                expense_id,
                amount,
                payment_date: payment_date || new Date(),
                notes: notes || ''
            });

            res.status(201).json({
                id: payment._id,
                ...payment.toObject()
            });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Payment API error:', error);
        res.status(500).json({ error: error.message });
    }
}
