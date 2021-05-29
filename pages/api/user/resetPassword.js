import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Accounts from '../../../models/accountModel'
import auth from '../../../middleware/auth'
import bcrypt from 'bcrypt'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "PATCH":
            await resetPassword(req, res)
            break;
    }
}


const resetPassword = async (req, res) => {
    try {
        const result = await auth(req, res)
        const { password, old_password} = req.body
        const users = await Users.findById({_id: result.id})
        const ComPareAccount = await Accounts.findById({_id : users.account})

        if(!bcrypt.compareSync(old_password, ComPareAccount.password)) return res.json({err: "Mật khẩu cũ không đúng."});
        
        if(bcrypt.compareSync(password, ComPareAccount.password)) return res.json({err: "Mật khẩu mới phải khác mật khẩu cũ."});
        
        const passwordHash = await bcrypt.hash(password, 12)
        const account = await Accounts.findOneAndUpdate({_id: users.account}, {password: passwordHash})

        res.json({ msg: "Đổi mật khẩu thành công."})   
    } catch (err) {
        return res.status(500).json({err: err.message})
    }   
}