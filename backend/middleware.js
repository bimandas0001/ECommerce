import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import {Session, User} from './schema.js';

dotenv.config();
const jwtKey = process.env.JWT_KEY;

// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

export const upload = multer({storage: storage})

// Middelware to fetch user data.
export function fetchUser(req, res, next) {
    let token = req.header('auth-token');
    try {
        let tokenData = jwt.verify(token, jwtKey);
        let userId = tokenData._id;
        req.body.userId = userId
        next();
    }
    catch(err) {
        res.status(401).send({error: "Unsuccessful to authenticate you !"})
    }
}

// Check if user is Admin
export const isAdmin = async function (req, res, next) {
    try {
        let userId = req.body.userId;
        let result = await User.findOne({_id: userId}, {isAdmin: 1})
        if(result.isAdmin === true) {
            next();
        }
        else {
            res.json({success: false, error: 'Your are not an admin.'});
        }
    }
    catch(err) {
        res.json({success: false, error: 'Error in server. Please try again.'});
    }
}

export const emailVeryfication = async function (req, res, next) {
    try {
        if(req.body.email === undefined || req.body.otp === undefined || (/^\d{6}$/).test(req.body.otp) === false) {
            res.json({success: false, error: "Email or OTP is not valid."})
        }
        else {
            let {email, otp} = req.body;
            let emailPresent = await Session.findOneAndDelete({email});
            let currTime = new Date();
            if(emailPresent && parseInt((currTime - emailPresent.createdAt)/1000) < parseInt(process.env.OTP_EXPIRE_TIME)) {
                if(emailPresent.otp === parseInt(otp)) {
                    next();
                }
                else {
                    res.json({success: false, error: "OTP didn't matched."})
                }
            }
            else {
                res.json({success: false, error: "The OTP has expired."})
            }
        }
    }
    catch(err) {
        res.json({success: false, error: 'Error in server. Please try again.'});
    }
}