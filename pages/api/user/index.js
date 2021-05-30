import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Accounts from '../../../models/accountModel'
import auth from '../../../middleware/auth'
import bcrypt from 'bcrypt'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "PATCH":
            await uploadInfor(req, res)
            break;
        case "GET":
            await getUsers(req, res)
            break;
    }
}
class APIUsersfeatures {
    constructor(query, queryString){
      this.query = query
      this.queryString = queryString
    }
    filtering(){
      const queryObj = {...this.queryString}
      
      const excludeFields = ['page', 'sort', 'limit']
      excludeFields.forEach(el => delete(queryObj[el]))
    
      if(queryObj.title !== 'all')
        this.query.find({email: {$regex: queryObj.title}})
  
      this.query.find()
      return this;
    }
    sorting(){
      if(this.queryString.sort){
          const sortBy = this.queryString.sort.split(',').join('')
          this.query = this.query.sort(sortBy)
      }else{
          this.query = this.query.sort('oldest')
      }
  
      return this;
    }
}

const getUsers = async(req, res) => {
    try {
        // const result = await auth(req,res)
        // if(result.role !== 'admin') return res.status(400, {error: 'Tài khoản không hợp lệ.'})
 
        const features = new APIUsersfeatures(Users.find().populate('account', '-password'), req.query).filtering().sorting() 
        const users = await features.query
       
        res.json({
            status: 'success',
            result: users.length,
            users
        })
       
        
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
    
}
const uploadInfor = async(req, res) => {
    try {
        const result = await auth(req,res)
        const {name, avata, sdt, gioiTinh, ngaySinh} = req.body
       
        const newUser = await Users.findByIdAndUpdate({_id: result.id},{ten: name, anhDaiDien: avata, sdt: sdt, gioiTinh: gioiTinh, ngaySinh: ngaySinh})
        const account = await Accounts.findById(newUser.account)

        res.json({
            msg: 'Update Profile success!',
            user: {
                name,
                avata,
                sdt,
                gioiTinh,
                ngaySinh,
                email: newUser.email,
                role: account.phanQuyen
            }

        })
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
    
}

