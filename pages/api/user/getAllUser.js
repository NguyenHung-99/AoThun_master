import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Accounts from '../../../models/accountModel'
import auth from '../../../middleware/auth'


connectDB()

export default async (req, res) => {
    switch(req.method){
        
        case "GET":
            await getAllUsers(req, res)
            break;
    }
}


const getAllUsers = async(req, res) => {
    try {
        const result = await auth(req,res)
        if(result.role !== 'admin') return res.status(400, {error: 'Tài khoản không hợp lệ.'})
 
        
        const users = await Users.find().populate('account', '-password')
       
        res.json({
            status: 'success',
            result: users.length,
            users
        })
       
        
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
    
}