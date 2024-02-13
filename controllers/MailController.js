import asyncHandler from 'express-async-handler'
import nodemailer from 'nodemailer'
import fs from "fs"
import Sub from '../models/Sub.js'

export const contact_us = asyncHandler(async (req, res, next) => {
    try{
        const {
            fullName,
            email,
            phone,
            subject,
            message
        } = req.body
        let transporter = nodemailer.createTransport({
            host: "mail.corestepmfb.com",
            port: 465,
            secure: true,
            auth: {
                user: "test@corestepmfb.com",
                pass: "coreserver22/24"
            }
        })

        let mailOptions = ({
            from: '"we" <test@corestepmfb.com',
            to: "ayodejiamzat@gmail.com, inthebayoutech@gmail.com",
            subject: `Contact us`,
            text: `
                email: ${req.body.email}, 
                fullName: ${req.body.fullName}, 
                phone: ${req.body.phone}, 
                subject: ${req.body.subject},
                message: ${req.body.message}
            `,
        })

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                return console.log(error)
            }else{
                res.json({message: "success"})
                console.log("email sent" + info.response)
                // res.send("success")
            }

            console.log("message sent: %s", info.messageId);
            console.log("preview url: %s", nodemailer.getTestMessageUrl(info));
        })
    } catch (error) {
		next(error);
	}
})

export const news_letter = asyncHandler(async (req, res, next) => {
    try{
        const {
            email,
        } = req.body
        const sub = await Sub.create({
            email,
        })

        if (sub) {
            res.status(201).json({
                message: 'success',
                status: 'ok',
                data: "Subscription successful",
            })
        } else {
            res.status(400)
            throw new Error('Invalid email provided.')
        }
    } catch (error) {
		next(error);
	}
})