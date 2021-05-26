import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'

connectDB()

export default async (req, res) => {
    switch (req.method) {
    
        case 'GET':
            await getOrderByID(req, res)
            break;
    }
}
const getOrderByID = async (req, res) => {
    try {
        const {id} = req.query;
        const order = await Orders.findById({_id: id});
        if(!order) return res.json({err: 'Đơn hàng không tồn tại!!!.'})
        return res.json({
            order: order,
            message: 'Tìm kiếm đơn hàng thành công'
        })
    } catch (err) {
        return res.json({
            err: 'Mã đơn hàng không tồn tại!!!.'
        })
    }
}

