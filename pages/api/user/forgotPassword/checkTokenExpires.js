import connectDB from '../../../../utils/connectDB'
import Users from '../../../../models/userModel'
import Accounts from '../../../../models/accountModel'
import jwt from 'jsonwebtoken'


connectDB()

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await checkTokenExpires(req, res)
            break;
    }
}


const checkTokenExpires = async (req, res) => {
    try {
        
        const {token} = req.body
        const decoded = jwt.verify(token, process.env.JWT_RESET_PASS)
        if(!decoded) return res.status(400).json({err: 'Invalid Authentication.'})
        
    } catch (err) {
        return res.json({err: err.message})
    }   
}