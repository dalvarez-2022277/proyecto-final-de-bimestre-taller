import Order from '../cart/order.model.js';

export const createOrder = async (req, res) => {
    const { userId, products, total } = req.body;
    
    try {
        const order = new Order({ user: userId, products, total });
        await order.save();
        
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
