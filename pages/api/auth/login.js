import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Accounts from '../../../models/accountModel'
import Addresss from '../../../models/addressModel'
import valid from '../../../utils/valid'
import bcrypt from 'bcrypt'
import {createAccessToken,createRefreshToken} from '../../../utils/generateToken'


connectDB()

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await login(req, res)
            break;
    }
}

const login = async (req, res) => {
    try{
      
        const {email, password} = req.body
        
        const user = await Users.findOne({ email })
        if(!user) return res.status(400).json({err: 'Tài khoản không tồn tại.'})
        const account = await Accounts.findById(user.account)
        const address = await Addresss.findById(user.diaChi)
        const isMatch = await bcrypt.compare(password, account.password);
        if(!isMatch) return res.status(400).json({err: 'Bạn đã nhập sai mật khẩu.'})
        if(account.trangThai === false) {
            return res.status(400).json({
                notActive: true,
                email: user.email
            })
        }

        const access_token = createAccessToken({id: user._id});
        const refresh_token = createRefreshToken({id: user._id});
        res.json({
            msg: "Đăng nhập thành công.",
            refresh_token,
            access_token,
            user:{
                name: user.ten,
                email: user.email,
                role: account.phanQuyen,
                root: account.root,
                avata: user.anhDaiDien,
                phone: user.sdt,
                address: address
                
            }
        })

    }catch(err){
        return res.status(500).json({err: err.message})
    }
}