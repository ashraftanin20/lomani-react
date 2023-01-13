import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs';
import data from "../data.js";
import User from "../models/userModel.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.get('/top-sellers', expressAsyncHandler(async(req, res) => {
    const topSellers = await User.find({ isSeller: true }).sort({'seller.rating':-1}).limit(3);
    res.send(topSellers);
}));

userRouter.get('/seed', 
    expressAsyncHandler(async (req, res) => {
        const createdUsers = await User.insertMany(data.users);
        res.send({ createdUsers });
}));

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(user) {
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isSeller: user.isSeller,
                token: generateToken(user)
            });
            return;
        } else {
            res.status(401).send({message: "Invalid email or password!"});
        }
    } else {
        res.status(401).send({message: "Invalid email or password!"});
    }
}));

userRouter.post('/register', expressAsyncHandler (async (req, res) => {
    const user = new User({name: req.body.name, email: req.body.email, 
                            password: bcrypt.hashSync(req.body.password, 8),
        });
        const createdUser = await user.save();
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            isSeller: createdUser.isSeller,
            token: generateToken(createdUser),
        });
    }) 
);

userRouter.get('/:id', expressAsyncHandler(async(req, res) => {
        const user = await User.findById(req.params.id);
        if(user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(user.isSeller) {
            user.seller.name = req.body.sellerName || user.seller.name;
            user.seller.logo = req.body.sellerLogo || user.seller.logo;
            user.seller.description = req.body.sellerDescription || user.seller.description;
        }
        if(req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const upddatedUser = await user.save();
        res.send({
            _id: upddatedUser._id,
            name: upddatedUser.name,
            email: upddatedUser.email,
            isAdmin: upddatedUser.isAdmin,
            isSeller: upddatedUser.isSeller,
            token: generateToken(upddatedUser),
        });
    }
    })
);

userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const users = await User.find({});
    res.send(users);
    })
);

userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        if(user.isAdmin) {
            res.status(404).send({message: 'Can not delete admin user!'});
            return;
        }
        const deletedUser = await user.remove();
        res.send({message: "User Deleted Successfully", user: deletedUser});
    } else {
        res.status(404).send({message: "User Not Found"});
    }
}));

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isSeller = Boolean(req.body.isSeller);
        user.isAdmin = Boolean(req.body.isAdmin);
        //user.isAdmin = req.body.isAdmin || user.isAdmin;
        //user.isSeller = req.body.isSeller || user.isSeller;
        const updateUser = await user.save();
        res.send({message: 'User Updated Succussfully', user: updateUser});
    }else {
        res.status(404).send({message: 'User Not Found'});
    }
}));

export default userRouter;