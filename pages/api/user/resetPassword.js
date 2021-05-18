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
        const { password } = req.body
        const passwordHash = await bcrypt.hash(password, 12)

        const users = await Users.findById({_id: result.id})
        const ComPareAccount = await Accounts.findById({_id : users.account})
    
        if(bcrypt.compareSync(password, ComPareAccount.password))
        {
            return res.status(500).json({err: "Mật khẩu mới phải khác mật khẩu cũ."})
        }
        else{
            const account = await Accounts.findOneAndUpdate({_id: users.account}, {password: passwordHash})

        res.json({ msg: "Password has Changed!"})
        }
        
    } catch (err) {
        return res.status(500).json({err: err.message})
    }   
}