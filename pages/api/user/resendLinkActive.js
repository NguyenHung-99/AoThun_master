import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Accounts from '../../../models/accountModel'
import jwt from 'jsonwebtoken'
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "PATCH":
            await resendLinkActiveUser(req, res)
            break;
    }
}


const resendLinkActiveUser = async (req, res) => {
    try {
        const token = req.body.token
     
        const decoded = jwt.verify(token, process.env.JWT_RESET_PASS)
        
        const newUser = await Users.findOne({"email" : decoded.newUser.email})
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SEND_MAIL_USER,
                pass: process.env.SEND_MAIL_PASSWORD
            }
        });
        const newtoken = jwt.sign({newUser} ,process.env.JWT_RESET_PASS, {expiresIn: '15m'});
        
        const emailData = {
            to: newUser.email,
            from: process.env.SEND_MAIL_USER,
            subject: 'Active tài khoản HTStore',
            html: `
                <h1>Vui lòng nhấn vào link dưới đây để active tài khoản của bạn</h1>
                <p>${process.env.BASE_URL}/activeUser/${newtoken}</p>
                <hr/>
                <p>Email này chứa những thông tin nhạy cảm và sẽ hết hạn trong vòng 15 phút</p>
                <p>${process.env.BASE_URL}</p>
            `
        }
       
        transporter.sendMail(emailData, function (err, info) {
            if(err){
                res.status(200).json({
                    status: 'fail',
                    err: 'Gửi email xác thực thất bại !'
                })
            }
            
            else
                res.json({msg: `Vui lòng kiểm tra Email: ${newUser.email} của bạn để active tài khoản!!!`})
        })
        
    } catch (err) {
        return res.status(500).json({err: err.message})
    }   
}