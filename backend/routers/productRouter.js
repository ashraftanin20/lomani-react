import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { isAuth, isSellerOrAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {
        const seller = req.query.seller || '';
        const sellerFilter = seller ? { seller } : {};
        const name = req.query.name || '';
        const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
        const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
        const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;
        const order = req.query.order || '';
        
        const nameFillter = name ? { name: { $regex: name, $options: 'i' }} : {};
        const category = req.query.category || '';
        const categoyFilter = category ? { category } : {};
        const priceFilter = min && max ? { price: { $gte: min, $lte: max }} : {};
        const ratingFilter = rating ? { rating: { $gte: rating }} : {};
        const sortOrder = order === 'lowest' ? { price: 1 } : order === 'highest' ? { price: -1 } :
                          order === 'toprated' ? { rating: -1 } : { _id: -1 };
        const products = await Product.find({...sellerFilter,
                                             ...nameFillter, 
                                             ...categoyFilter,
                                            ...priceFilter,
                                            ...ratingFilter})
                                             .populate('seller', 'seller.name seller.logo')
                                             .sort(sortOrder);
        res.send(products);
    })
);

productRouter.get('/categories', expressAsyncHandler(async(req, res) => {
        const categories = await Product.find().distinct('category');
        res.send(categories);
    })
);

productRouter.get('/seed', expressAsyncHandler(async(req, res) => {
    const seller = await User.findOne({ isSeller: true });
    if(seller) {
        const products = data.products.map((product) => ({
            ...product,
            seller: seller._id,
        }));
        const createdProduct = await Product.insertMany(products);
        res.send({ createdProduct });
    } else {
        res.status(500).send({message: 'No seller found. first run /api/users/seed'});
    }
}));

productRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id)
                                                .populate('seller', 'seller.name seller.logo seller.rating seller.numReviews');;
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
        
    })
);

productRouter.post('/', isAuth, isSellerOrAdmin, expressAsyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample Name' + Date.now(),
        seller: req.user._id,
        image: '/images/p1.jpg',
        price: 0,
        category: 'Sample Category',
        brand: 'Sample Brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'Sample description',
    });
    const createdProduct = await product.save();
    res.send({ message: 'Prodcut created', product: createdProduct });
}));

productRouter.put('/:id', isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        
        const updatedProdct = await product.save();
        res.send({message: 'Product Updated', product: updatedProdct});
    }else {
        res.status(404).send({ message: 'Product Not Found'});
    }
}));

productRouter.delete('/:id', isAuth, expressAsyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        const deleteProduct = await product.remove();
        res.send({message: 'Product Deleted', product: deleteProduct});
    } else {
        res.status(404).send({message: 'Product Not Found'});
    }
}));

productRouter.post('/:id/reviews', isAuth, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product) {
        if(product.reviews.find(x => x.name === req.user.name)) {
            return res.status(400).send({message: "You already add a review!"});
        }
        const review = { name: req.user.name, rating: Number(req.body.rating), comment: req.body.comment, };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;

        const updatedProdct = await product.save();
        res.status(201).send({message: "Review Created", review: updatedProdct.reviews[updatedProdct.reviews.length - 1]});
    }else {
        res.status(404).send({ message: 'Product Not Found'});
    }
}));

export default productRouter;