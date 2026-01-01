import connectDB from '../../../lib/mongodb';
import Expense from '../../../models/Expense';
import Payment from '../../../models/Payment';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        await connectDB();

        if (req.method === 'GET') {
            const expense = await Expense.findById(id);

            if (!expense) {
                return res.status(404).json({ error: 'Expense not found' });
            }

            const payments = await Payment.find({ expense_id: id }).sort({ payment_date: -1 });
            const total_paid = payments.reduce((sum, p) => sum + p.amount, 0);
            const remaining_amount = expense.estimated_amount - total_paid;

            res.status(200).json({
                id: expense._id,
                event_name: expense.event_name,
                vendor_name: expense.vendor_name,
                estimated_amount: expense.estimated_amount,
                notes: expense.notes,
                created_at: expense.created_at,
                updated_at: expense.updated_at,
                total_paid,
                remaining_amount,
                payments: payments.map(p => ({
                    id: p._id,
                    expense_id: p.expense_id,
                    amount: p.amount,
                    payment_date: p.payment_date,
                    notes: p.notes,
                    created_at: p.created_at
                }))
            });
        } else if (req.method === 'PUT') {
            const { event_name, vendor_name, estimated_amount, notes } = req.body;

            const expense = await Expense.findByIdAndUpdate(
                id,
                {
                    event_name,
                    vendor_name: vendor_name || '',
                    estimated_amount,
                    notes: notes || '',
                    updated_at: Date.now()
                },
                { new: true }
            );

            if (!expense) {
                return res.status(404).json({ error: 'Expense not found' });
            }

            res.status(200).json({
                id: expense._id,
                ...expense.toObject()
            });
        } else if (req.method === 'DELETE') {
            const expense = await Expense.findByIdAndDelete(id);

            if (!expense) {
                return res.status(404).json({ error: 'Expense not found' });
            }

            // Delete all associated payments
            await Payment.deleteMany({ expense_id: id });

            res.status(200).json({ message: 'Expense deleted successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Expense API error:', error);
        res.status(500).json({ error: error.message });
    }
}
