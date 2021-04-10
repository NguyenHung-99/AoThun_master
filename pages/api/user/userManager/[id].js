import connectDB from '../../../../utils/connectDB'
import Users from '../../../../models/userModel'
import Accounts from '../../../../models/accountModel'
import Addresss from '../../../../models/addressModel'
import auth from '../../../../middleware/auth'


connectDB()

export default async (req, res) => {
    switch(req.method){
        case "PATCH":
            await updateRole(req, res)
            break;
        case "DELETE":
            await DeleteUser(req, res)
            break;
        
    }
}

const DeleteUser = async(req, res) => {
    try {
        const result = await auth(req,res)
        if(result.role !== 'admin' || !result.root) return res.status(400, {error: 'Tài khoản không hợp lệ.'})

        const {id} = req.query

        const users = await Users.findById(id)      
        await Accounts.findByIdAndDelete({_id: users.account})
        await Addresss.findByIdAndDelete({_id: users.diaChi})
        await Users.findByIdAndDelete(id)

        
        res.json({msg: 'Deleted Success!'})
        
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
    
}

const updateRole = async(req, res) => {
    try {
        const result = await auth(req,res)
        if(result.role !== 'admin' || !result.root) return res.status(400, {error: 'Tài khoản không hợp lệ.'})

        const {id} = req.query
        const {role} = req.body

        const users = await Users.findById(id)
      
        await Accounts.findOneAndUpdate({_id: users.account},{phanQuyen: role})
        res.json({msg: 'Update Success!'})
        
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
    
}