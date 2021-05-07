import connectDB from '../../../../../utils/connectDB'
import Orders from '../../../../../models/orderModel'
import moment from 'moment'

connectDB()

export default async (req, res) => {
    switch(req.method){
        
        case 'GET': 
            await getDataOrders_3Month(req, res)
            break;
    }
}

const getDataOrders_3Month = async (req, res) => {
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
        var order1 = 0;
        var order2 = 0;
        var order3 = 0;
        var arrOrderDetail = [];

        for (let index2 = 0; index2 < result.length; index2++) {
            if (thangThuNhat.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuNhat.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                order1 += 1;
                arrOrderDetail.push(result[index2])
            }

            if (thangThuHai.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuHai.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                order2 += 1;
                arrOrderDetail.push(result[index2])
            }

            if (thangThuBa.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuBa.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                order3 += 1;
                arrOrderDetail.push(result[index2])
            }
        }
        arrOrder.push(order3, order2, order1);
        
        var arrDateResult = [];

        var stringThangThuNhat = (thangThuNhat.getMonth() + 1).toString() + '/' + (thangThuNhat.getFullYear()).toString();
        var stringThangThuHai = (thangThuHai.getMonth() + 1).toString() + '/' + (thangThuHai.getFullYear()).toString();
        var stringThangThuBa = (thangThuBa.getMonth() + 1).toString() + '/' + (thangThuBa.getFullYear()).toString();

        arrDateResult.push(stringThangThuBa, stringThangThuHai, stringThangThuNhat);


        res.status(200).json({
            status: 'success',
            data: arrOrderDetail,
            dataDate: arrDateResult,
            dataSoDonHang: arrOrder,
            message: 'Tính số đơn hàng 3 tháng gần nhất thành công'
        });
        
    } catch (err) {
        return res.status(500).json({err: 'Lấy data số đơn hàng 3 tháng gần nhất thất bại'})
    }
}

