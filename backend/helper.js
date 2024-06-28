import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendMail(receiverEmail, otp) {
    // console.log("OTP -> " + otp);
    // return true;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiverEmail,
        subject: 'Email veryfication',
        // text: `OTP is ${otp}. Valid for ${process.env.OTP_EXPIRE_TIME /60} minutes.`
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        padding: 20px;
                        background-color: #f9f9f9;
                        border: 1px solid #ddd;
                        max-width: 600px;
                        margin: auto;
                    }
                    h1 {
                        color: #007BFF;
                    }
                    p {
                        font-size: 16px;
                        color: #555;
                    }
                    .otp {
                        font-size: 24px;
                        color: #FF5733;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Your OTP Code</h1>
                    <p>Dear user,</p>
                    <p>Your One-Time Password (OTP) is:</p>
                    <p class="otp">${otp}</p>
                    <p>Please use this code to complete your process. This OTP is valid for <strong>${process.env.OTP_EXPIRE_TIME /60} minutes</strong>.</p>
                </div>
            </body>
            </html>
        `

    };

    try {
        const info = await transporter.sendMail(mailOptions);
        // console.log(info.response);
        return true;
    } 
    catch (err) {
        return false;
    }
}

export function randomGenerator(len) {
    let ret = "";
    for(let i=0; i<len; i++) {
        ret += Math.floor(Math.random() * 10);
    }

    return ret;
}