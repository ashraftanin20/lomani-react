import express from 'express';
import data from './data.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is ready.');
});

app.get('/api/products', (req, res) => {
    res.send(data.products);
});

app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = data.products.find((x) => x._id === id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({message: 'Product not Found!'});
    }
    
})

app.listen(PORT, () => {
    console.log('Serve at http://localhost:' + PORT);
});