import connectDB from '../../../../utils/connectDB'
import Users from '../../../../models/userModel'
import jwt from 'jsonwebtoken'
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


connectDB()

export default async (req,res) => {
    switch(req.method){
      case 'POST':
        await sendEmail_ResetPassword(req,res)
        break;
    }
}
const sendEmail_ResetPassword = async (req,res) => {
  try{
      
    const email = req.body.email
    const user = await Users.findOne({email: email})
    if(user){
    
        const token = jwt.sign({user} ,process.env.JWT_RESET_PASS, {expiresIn: '15m'});

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SEND_MAIL_USER,
                pass: process.env.SEND_MAIL_PASSWORD
            }
        });
        
        const emailData = {
            to: user.email,
            from: process.env.SEND_MAIL_USER,
            subject: 'Đổi Mật khẩu tài khoản HTStore',
            html: `
                <h1>Vui lòng nhấn vào link dưới đây để đổi mật khẩu</h1>
                <p>${process.env.BASE_URL}/changePassword/${token}</p>
                <hr/>
                <p>Email này chứa những thông tin nhạy cảm và sẽ hết hạn trong vòng 15 phút</p>
                <p>${process.env.BASE_URL}</p>
            `
        }
        transporter.sendMail(emailData, function (err, info) {
            if(err){
                res.status(200).json({
                    status: 'fail',
                    message: 'Gửi email xác thực thất bại !'
                })
            }
            
            else
                res.json({
                    status: 'success',
                    message: `Email đã được gửi đến ${user.email}`
                })
        })

    }else{
        res.json({errMsg: 'Không có email này'})
    }
      
  }catch(err){
      return res.status(500).json({err: err.mesage})
  }
}