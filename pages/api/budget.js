import connectDB from '../../lib/mongodb';
import Budget from '../../models/Budget';

export default async function handler(req, res) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            let budget = await Budget.findOne().sort({ created_at: -1 });

            // Create default budget if none exists
            if (!budget) {
                budget = await Budget.create({ total_budget: 0 });
            }

            res.status(200).json(budget);
        } else if (req.method === 'PUT') {
            const { total_budget } = req.body;

            if (total_budget === undefined || total_budget < 0) {
                return res.status(400).json({ error: 'Valid budget amount required' });
            }

            let budget = await Budget.findOne().sort({ created_at: -1 });

            if (!budget) {
                budget = await Budget.create({ total_budget });
            } else {
                budget.total_budget = total_budget;
                budget.updated_at = Date.now();
                await budget.save();
            }

            res.status(200).json(budget);
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Budget API error:', error);
        res.status(500).json({ error: error.message });
    }
}
