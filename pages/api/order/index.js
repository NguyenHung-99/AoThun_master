import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import auth from '../../../middleware/auth'
import Products from '../../../models/productModel'
import Addresss from '../../../models/addressModel'
import Users from '../../../models/userModel'


connectDB()



export default async (req, res) => {
    switch(req.method){
        case 'POST': 
            await createOrder(req, res)
            break;
        case 'GET': 
            await getOrders(req, res)
            break;
    }
}
const getOrders = async (req,res) => {
    try {
        const result = await auth(req,res)
        let orders;
      
        //user => get all oders by users
        if(result.role !== 'admin'){
            orders = await Orders.find({user: result.id}).populate("user", "-diaChi")
        }else{
            //get all order in db
            orders = await Orders.find().populate("user", "-diaChi")
          
        }
        res.json({orders, totalOrd: orders.length})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

const createOrder = async (req, res) => {
    try {
        const result = await auth(req,res)
        const {name, email, sdt, diachi, phuongxa, quanhuyen, tinhtp, total, cart} = req.body

        const users = await Users.findById({_id: result.id})
        const address = await Addresss.findById(users.diaChi)
        if(diachi !== address.diaChi || phuongxa !== address.phuongXa || quanhuyen !== address.quanHuyen || tinhtp !== address.tinhThanhPho){
            await Addresss.findByIdAndUpdate({_id: users.diaChi},{diaChi: diachi, phuongXa: phuongxa, quanHuyen: quanhuyen, tinhThanhPho: tinhtp})
        }
        
        const newOrders = new Orders({
            user: result.id, address: address._id, mobile: sdt, cart , total

        })
        
        //cập nhật số lượng sản phẩm còn trong kho và đã bán
   
        cart.filter(item => {
            const sizeSelect = item.size.filter(itemSize => itemSize.Size === item.sizeSelection)
            sizeSelect[0].InStock_Size = sizeSelect[0].InStock_Size - item.quantity
            sizeSelect[0].sold = sizeSelect[0].sold + item.quantity
            return sold(item._id, item.quantity, sizeSelect[0], item.sizeSelection) 
        })
       
        newOrders.save()
        res.json({
            msg: 'Order thành công! Chúng tôi sẻ liên hệ với bạn để xác nhận đơn hàng.',
            newOrders,
           
        })
        
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

//Cập nhât instock, old và instock, old từng size

const sold = async (id, quantity, sizeUpdate, sizeSelection) => {
    await Products.findOneAndUpdate({_id: id }, {$inc: {inStock: -quantity, sold: +quantity}});
   await Products.findOneAndUpdate({_id: id }, {$set: {"size.$[el].InStock_Size": sizeUpdate.InStock_Size, "size.$[el].sold": sizeUpdate.sold}}, {arrayFilters: [{"el.Size": sizeSelection}]}).then(iss => console.log(iss))
    
}


