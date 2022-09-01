import express from 'express';
import mongoose from 'mongoose';
import data from './data.js';
import userRouter from './routers/userRouter.js';


const app = express();
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/lomani', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.get('/', (req, res) => {
    res.send('Server is ready.');
});

app.use('/api/users', userRouter);
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
    
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Serve at http://localhost:' + PORT);
});