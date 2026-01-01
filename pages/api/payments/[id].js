import connectDB from '../../../lib/mongodb';
import Payment from '../../../models/Payment';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        await connectDB();

        if (req.method === 'DELETE') {
            const payment = await Payment.findByIdAndDelete(id);

            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            res.status(200).json({ message: 'Payment deleted successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Payment delete API error:', error);
        res.status(500).json({ error: error.message });
    }
}
