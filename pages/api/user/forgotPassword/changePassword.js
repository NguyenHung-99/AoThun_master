import connectDB from '../../../../utils/connectDB'
import Users from '../../../../models/userModel'
import Accounts from '../../../../models/accountModel'
import auth from '../../../../middleware/auth'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "PATCH":
            await changePassword(req, res)
            break;
    }
}


const changePassword = async (req, res) => {
    try {
        const token = req.body.token
        const password = req.body.password
        const decoded = jwt.verify(token, process.env.JWT_RESET_PASS)
        if(!decoded) return res.status(400).json({err: 'Token hết hạn. Vui lòng đổi mật khẩu lại.'})
        const user = await Users.findOne({"email" : decoded.user.email})
        if(!user){
            res.status(200).json({
                status: 'fail',
                msg: 'Đổi mật khẩu mới thất bại',
            });
        }else{
            const passwordHash = await bcrypt.hash(password, 12)
            const account = await Accounts.findOneAndUpdate({_id: user.account}, {password: passwordHash})

            res.json({ msg: "Update Success!"})
        }
    } catch (err) {
        return res.status(500).json({err: 'Token hết hạn. Vui lòng đổi mật khẩu lại.'})
    }   
}