import connectDB from '../../../../utils/connectDB'
import Orders from '../../../../models/orderModel'
import Products from '../../../../models/productModel'
import auth from '../../../../middleware/auth'

connectDB()

export default async(req,res) => {
    switch(req.method){
        case "PATCH":
            await deliveredOrderd(req, res)
            break;
    }
}
const deliveredOrderd = async(req, res) => {
    try {
        const result = await auth(req, res)
        
        //if(result.role !== 'admin') return res.status(400).json({err: 'Tài khoản không hợp lệ.'})

        const {id} = req.query
        const {delivere} = req.body
        console.log(delivere + 'hung api')
        
        const order = await Orders.findOne({_id: id})
        if(order.paid){
            await Orders.findOneAndUpdate({_id: id}, {delivered: delivere})
            if(delivere === 'Hủy đơn hàng: Giao hàng không thành công vì đúng địa chỉ không có người nhận hàng' ||
            delivere === 'Hủy đơn hàng: Giao hàng không thành công vì sai địa chỉ nhận hàng' ||
            delivere === 'Đã hủy đơn hàng'){
                order.cart.filter(item => {
                   
                    return updateSold(item._id, item.quantity, item.sizeSelection)
                })
            }
            res.json({
                msg: 'Cập nhật trạng thái đơn hàng thành công.',
                result: {
                    paid: true, 
                    dateOfPayment: order.dateOfPayment, 
                    method: order.method, 
                    delivered: delivere
                }
            })
        }else{
            if(delivere === 'Đã giao hàng'){
                await Orders.findOneAndUpdate({_id: id}, {
                    paid: true, dateOfPayment: new Date().toISOString(), 
                    method: 'Tiền mặt', delivered: delivere
                })
        
                res.json({
                    msg: 'Cập nhật trạng thái đơn hàng thành công.',
                    result: {
                        paid: true, 
                        dateOfPayment: new Date().toISOString(), 
                        method: 'Tiền mặt', 
                        delivered: delivere
                    }
                })
            }else{
                await Orders.findOneAndUpdate({_id: id}, {delivered: delivere})
                if(delivere === 'Hủy đơn hàng: Giao hàng không thành công vì đúng địa chỉ không có người nhận hàng' ||
                delivere === 'Hủy đơn hàng: Giao hàng không thành công vì sai địa chỉ nhận hàng' ||
                delivere === 'Đã hủy đơn hàng'){
                    order.cart.filter(item => {
                       
                        return updateSold(item._id, item.quantity, item.sizeSelection)
                    })
                }
                res.json({
                    msg: 'Cập nhật trạng thái đơn hàng thành công.',
                    result: {
                        paid: false, 
                        dateOfPayment: new Date().toISOString(), 
                        method: '', 
                        delivered: delivere
                    }
                })
            }
            
        }
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}
const updateSold = async (id, quantity, sizeSelection) => {
    const product = await Products.findById({_id: id})
    const sizeSelect = product.size.filter(itemSize => itemSize.Size === sizeSelection)
    sizeSelect[0].InStock_Size = sizeSelect[0].InStock_Size + quantity
    sizeSelect[0].sold = sizeSelect[0].sold - quantity
    await Products.findOneAndUpdate({
        _id: id
    }, {
        $inc: {
            inStock: +quantity,
            sold: -quantity
        }
    });
    await Products.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            "size.$[el].InStock_Size": sizeSelect[0].InStock_Size,
            "size.$[el].sold": sizeSelect[0].sold
        }
    }, {
        arrayFilters: [{
            "el.Size": sizeSelection
        }]
    })

}