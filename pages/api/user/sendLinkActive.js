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
            await sendLinkActive(req, res)
            break;
    }
}


const sendLinkActive = async (req, res) => {
    try {
        const email = req.body.email
        const newUser = await Users.findOne({email: email}).populate('account', 'diaChi')
        if(!newUser) return res.status(400).json({err: 'Không có tài khoản này!'})
     
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hungrau.store@gmail.com',
                pass: 'Hungraustore99'
            }
        });
        const token = jwt.sign({newUser} ,process.env.JWT_RESET_PASS, {expiresIn: '15m'});
        
        const emailData = {
            to: newUser.email,
            from: process.env.EMAIL_FROM,
            subject: 'Active tài khoản HTStore',
            html: `
                <h1>Vui lòng nhấn vào link dưới đây để active tài khoản của bạn</h1>
                <p>${process.env.BASE_URL}/activeUser/${token}</p>
                <hr/>
                <p>Email này chứa những thông tin nhạy cảm và sẽ hết hạn trong vòng 15 phút</p>
                <p>${process.env.BASE_URL}</p>
            `
        }
       
        transporter.sendMail(emailData, function (err, info) {
            if(err){
                res.status(200).json({
                    status: 'fail',
                    msg: 'Gửi email xác thực thất bại !'
                })
            }
            
            else
                res.json({msg: `Vui lòng kiểm tra Email: ${email} của bạn để active tài khoản!!!`})
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }   
}