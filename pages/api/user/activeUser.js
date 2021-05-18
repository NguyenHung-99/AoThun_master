import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Accounts from '../../../models/accountModel'
import jwt from 'jsonwebtoken'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "PATCH":
            await activeUser(req, res)
            break;
    }
}


const activeUser = async (req, res) => {
    try {
        const token = req.body.token
     
        const decoded = jwt.verify(token, process.env.JWT_RESET_PASS)
        
        if(!decoded) return res.status(400).json({err: 'Token hết hạn'})
        const user = await Users.findOne({"email" : decoded.newUser.email})
        console.log(user)
        if(!user){
            res.status(200).json({
                status: 'fail',
                msg: 'Active tài khoản thất bại',
            });
        }else{
           
            const account = await Accounts.findOneAndUpdate({_id: user.account}, {trangThai: true})

            res.json({ msg: "Active tài khoản thành công!"})
        }
    } catch (err) {
        return res.status(500).json({err: 'Token hết hạn. Vui lòng nhấn Resend Code.'})
    }   
}