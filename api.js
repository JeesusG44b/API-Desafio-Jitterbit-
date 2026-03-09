const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/order_management';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const ItemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: [ItemSchema]
}, { versionKey: false });

const Order = mongoose.model('Order', OrderSchema);

const parseOrderPayload = (payload) => {
    if (!payload.numeroPedido || !payload.valorTotal || !payload.dataCriacao) {
        throw new Error('Campos obrigatórios ausentes');
    }

    return {
        orderId: payload.numeroPedido,
        value: Number(payload.valorTotal),
        creationDate: new Date(payload.dataCriacao),
        items: (payload.items || []).map(item => ({
            productId: Number(item.idItem),
            quantity: Number(item.quantidadeItem),
            price: Number(item.valorItem)
        }))
    };
};

app.get('/order/list', async (req, res) => {
    try {
        const orders = await Order.find({}, { _id: 0 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar pedidos', details: error.message });
    }
});

app.post('/order', async (req, res) => {
    try {
        const data = parseOrderPayload(req.body);

        const exists = await Order.findOne({ orderId: data.orderId });
        if (exists) {
            return res.status(409).json({ error: `Pedido ${data.orderId} já existe.` });
        }

        const order = await Order.create(data);
        const result = order.toObject();
        delete result._id;

        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'Campos obrigatórios ausentes') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao criar pedido', details: error.message });
    }
});

app.get('/order/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id }, { _id: 0 });
        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pedido', details: error.message });
    }
});

app.put('/order/:id', async (req, res) => {
    try {
        const data = parseOrderPayload(req.body);
        data.orderId = req.params.id; 

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            data,
            { new: true, projection: { _id: 0 } }
        );

        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
        
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar pedido', details: error.message });
    }
});

app.delete('/order/:id', async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ orderId: req.params.id });
        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar pedido', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));