import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs';
import data from "../data.js";
import User from "../models/userModel.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const userRouter = express.Router();

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
        if(req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const upddatedUser = await user.save();
        res.send({
            _id: upddatedUser._id,
            name: upddatedUser.name,
            email: upddatedUser.email,
            isAdmin: upddatedUser.isAdmin,
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
        user.isAdmin = req.body.isAdmin || user.isAdmin;
        user.isSeler = req.body.isSeler || user.isSeler;
        const updateUser = await user.save();
        res.send({message: 'User Updated Succussfully', user: updateUser});
    }else {
        res.status(404).send({message: 'User Not Found'});
    }
}));

export default userRouter;