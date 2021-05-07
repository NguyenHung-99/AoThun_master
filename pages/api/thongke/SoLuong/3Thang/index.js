import connectDB from '../../../../../utils/connectDB'
import Orders from '../../../../../models/orderModel'
import moment from 'moment'

connectDB()

export default async (req, res) => {
    switch(req.method){
        
        case 'GET': 
            await getDataProduct_3Month(req, res)
            break;
    }
}

const getDataProduct_3Month = async (req, res) => {
    try {
        var curr = new Date(); // get current date

        var thangThuNhat = new Date(curr.getFullYear(), curr.getMonth() - 1, 1);
        var thangThuHai = new Date(curr.getFullYear(), curr.getMonth() - 2, 1);
        var thangThuBa = new Date(curr.getFullYear(), curr.getMonth() - 3, 1);

        var arrOrder = [];

        var result = (await Orders.find().populate("user")).filter(ord => {
            if(ord.dateOfPayment){
                return ord
            }
        })
        var outStock1 = 0;
        var outStock2 = 0;
        var outStock3 = 0;
        var arrOrderDetail = [];

        for (let index2 = 0; index2 < result.length; index2++) {
            if (thangThuNhat.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuNhat.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                    result[index2].cart.map(it => outStock1 += it.quantity)
                arrOrderDetail.push(result[index2])
            }

            if (thangThuHai.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuHai.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                    result[index2].cart.map(it => outStock2 += it.quantity)
                arrOrderDetail.push(result[index2])
            }

            if (thangThuBa.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuBa.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                    result[index2].cart.map(it => outStock3 += it.quantity)
                arrOrderDetail.push(result[index2])
            }
        }
        arrOrder.push(outStock3, outStock2, outStock1);
        
        var arrDateResult = [];

        var stringThangThuNhat = (thangThuNhat.getMonth() + 1).toString() + '/' + (thangThuNhat.getFullYear()).toString();
        var stringThangThuHai = (thangThuHai.getMonth() + 1).toString() + '/' + (thangThuHai.getFullYear()).toString();
        var stringThangThuBa = (thangThuBa.getMonth() + 1).toString() + '/' + (thangThuBa.getFullYear()).toString();

        arrDateResult.push(stringThangThuBa, stringThangThuHai, stringThangThuNhat);


        res.status(200).json({
            status: 'success',
            data: arrOrderDetail,
            dataDate: arrDateResult,
            dataSanPham: arrOrder,
            message: 'Tính số sản phẩm 3 tháng gần nhất thành công'
        });
        
    } catch (err) {
        return res.status(500).json({err: 'Lấy data số sản phẩm 3 tháng gần nhất thất bại'})
    }
}

