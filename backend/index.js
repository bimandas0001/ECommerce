import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import modules
import {connectToDatabase, disconnectFromDatabase} from './model/database.js';
import {Product, Session, User} from './model/schema.js';
import { upload, fetchUser, isAdmin, emailVeryfication } from './middleware.js';
import { sendMail, randomGenerator } from './helper/helper.js';
import { uploadPhoto, deletePhoto } from './firebase/firebaseOperations.js';

dotenv.config();

const app = express();
app.use(express.json())
app.use(cors())

// Upload endpoint for images
app.use('/images', express.static('upload/images'))

const port = process.env.SERVER_LISTENING_PORT || 4000;
const jwtKey = process.env.JWT_KEY;
// Connect database.
connectToDatabase();

// Disconnect database on `Ctrl + C`
process.on('SIGINT', async () => {
    await disconnectFromDatabase();
    process.exit(0);
});

// Listen on port...
app.listen(port, (error) => {
    if(error)   console.log("Error (Server running) : " + error);
    else    console.log("Server running port : " + port);
})

// Operations on products.
app.post('/addproduct', fetchUser, isAdmin, upload.single('product-image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        // Fetch next available product id.
        let id;
        let products = await Product.find({}).sort({id: 1});
        if(products.length > 0)    id = products.slice(-1)[0].id + 1;
        else    id = 1;

        // Store product image to cloud storage.
        const destination = `Products/P_${id}${path.extname(file.originalname)}`;
        const publicUrl = await uploadPhoto(file.buffer, destination, file.mimetype);

        const product = new Product({
            id: id,
            name: req.body.name,
            image: publicUrl,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            date: new Date()
        })

        await product.save();
        res.json({
            success: true,
        })
    }
    catch(err) {
        res.json({
            success: false,
            error: "Something is wrong in database. Try again."
        })
    }
})

app.post('/removeproduct', fetchUser, isAdmin, async (req, res) => {
    try {
        let deletedProduct  = await Product.findOneAndDelete({id: req.body.id})        
        if(!deletedProduct ) {
            return res.json({success: false, error: "Something is wrong in database. Try again."})
        }

        await deletePhoto(deletedProduct.image)
        res.json({success: true})
    }
    catch(err) {
        res.json({success: false, error: "Something is wrong in database. Try again."})
        console.log(err)
    }
})

app.get('/allproducts', async(req, res) => {
    let allProducts = await Product.find({}).sort({id: 1});
    res.send(allProducts)
})


app.post('/getcartitems', fetchUser,  async (req, res) => {
    let userId = req.body.userId;
    try {
        let userData = await User.findOne({_id: userId}, {cart: 1})
        res.json({
            success: true,
            cartItems: userData.cart
        })
    }
    catch(err) {
        res.json({
            success: false,
            error: "Something is wrong! Try again."
        })
    }
})

app.post('/updatecart', fetchUser, async (req, res) => {
    try {
        let userId = req.body.userId;
        let itemId = req.body.itemId;
        let change = req.body.change;
        if(Math.abs(change) !== 1) {
            res.status(401).json({error: "Change value must be +1 or -1"});
        }

        let userData = await User.findOne({_id: userId})
        let cart = userData.cart;

        if(cart.hasOwnProperty(itemId) === false)    cart[itemId] = 0;
        cart[itemId] = Math.max(0, cart[itemId] + change);
        if(cart[itemId] === 0)    delete cart[itemId];

        await User.findOneAndUpdate({_id: userId}, {$set: {cart: cart}})

        res.json({success: true, updatedCart: cart})
    }
    catch(err) {
        res.json({success: false, error: "Failed to update cart. Try again"})
    }
})

app.post('/login', async (req, res) => {
    try {
        let findUser = await User.findOne({email: req.body.email, password: req.body.password})
        if(findUser !== null) {
            const token = jwt.sign(JSON.stringify({_id: findUser._id}), jwtKey)
            if(findUser.isAdmin) {
                res.json({success: true, isAdmin: true, token: token})
            }
            else {
                res.json({success: true, token: token})
            }
        }
        else {
            res.json({
                success: false,
                error: "Email id or password is not correct."
            })
        }
    }
    catch(err) {
        res.json({success: false, error: "Something is wrong. Please try again."})
    }
})

app.post('/email-veryfication', async (req, res) => {
    try {
        if(req.body.email === undefined || (/^(?=.{1,320}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(req.body.email) === false) {
            res.json({success: false, error: "Email id is not valid."})
        }
        else {
            let email = req.body.email;
            let result = await User.findOne({email: email});
            
            if(result) {
                res.json({success: false, error: "The email is already registered."})
            }
            else {
                let otp = parseInt(randomGenerator(6));
                if(sendMail(email, otp) === false) {
                    res.json({success: false, error: "Error in server! Please try again."})
                }
                else {
                    let emailPresent = await Session.findOne({email: email});
                    let timeGap;
                    if(emailPresent) {
                        let currTime = new Date();
                        timeGap = parseInt((currTime - emailPresent.createdAt) / 1000);
                    }
                    if(emailPresent && timeGap < parseInt(process.env.OTP_RESEND_TIME)) {
                        res.json({success: false, error: `You have already requested for an otp. We will resend OTP after ${parseInt(process.env.OTP_RESEND_TIME) - timeGap} seconds`})
                    }
                    else {
                        if(emailPresent) {
                            await Session.deleteOne({email: email})
                        }
                        
                        const session = new Session({
                            email: email,
                            otp: otp,
                            createdAt: new Date()
                        })
                        
                        let result = await session.save();
                        if(result) {
                            res.json({success: true})
                        }
                        else {
                            throw "Error in database";
                        }
                    }
                }
            }
        }
    }
    catch(err) {   
        res.json({success: false, error: "Something is wrong! Try again."})
    }
})

app.post('/signup', emailVeryfication, async (req, res) => {
    try {
        if(req.body.name === undefined || req.body.password === undefined 
            || (/^[a-zA-Z\s]{3,50}$/).test(req.body.name) === false 
            || (/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:'"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()\-_=+\[\]{};:'"\\|,.<>/?`~]{8,16}$/).test(req.body.password) === false) {
            res.json({success: false, error: "Input data is not valid."})
        }
        else {
            const user = User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            
            await user.save();
            let findUser = await User.findOne({email: req.body.email})
            if(findUser) {
                const token = jwt.sign(JSON.stringify({_id: findUser._id}), jwtKey)
                res.json({success: true, token: token})
            }
            else {
                res.json({success: false, error: "Failed to register you ! Please try again."});
            }
        }
    }
    catch(err) {
        res.json({success: false, error: "Something is wrong! Try again."})
    }
})
