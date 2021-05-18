import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Accounts from '../../../models/accountModel'
import Addresss from '../../../models/addressModel'
import valid from '../../../utils/valid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const sgMail = require('@sendgrid/mail') 
sgMail.setApiKey(process.env.SEND_MAIL_KEY);

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


connectDB()

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await register(req, res)
            break;
    }
}

const register = async (req, res) => {
    try{
      
        const {name , sdt, email, ngaySinh, gioiTinh, password, cf_password } = req.body
        const errMsg = valid(name , sdt, email, ngaySinh, gioiTinh, password, cf_password);
        if(errMsg) return res.status(400).json({err: errMsg})
        const user = await Users.findOne({ email })
        if(user) return res.status(400).json({err: 'This email already exists.'})

        const passwordHash = await bcrypt.hash(password, 12)
        
        // Tạo account cho user
        let account = {}
        account.password = passwordHash
        account.trangThai = false
        let userAccount = new Accounts(account)
        await userAccount.save();
    
        // Tạo Address mặc định cho user
        let userAddress = new Addresss();
        await userAddress.save();

        let userSignup = {};
        userSignup.ten = name;
        userSignup.sdt = sdt;
        userSignup.email = email;
        userSignup.ngaySinh = ngaySinh;
        userSignup.gioiTinh = gioiTinh;
        userSignup.account = userAccount.id;
        userSignup.diaChi = userAddress.id;
        const newUser = new Users(userSignup)
        await newUser.save()

        //send email active user

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hungrau.store@gmail.com',
                pass: 'Hungraustore99'
            }
        });
        const token = jwt.sign({newUser} ,process.env.JWT_RESET_PASS, {expiresIn: '15m'});
        
        const emailData = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Đăng kí thành công tài khoản HTStore',
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
                res.json({msg: `Đăng kí thành công! Vui lòng kiểm tra Email: ${email} của bạn để active tài khoản!!!`})
        })
    }catch(err){
        return res.status(500).json({err: err.message})
    }
}