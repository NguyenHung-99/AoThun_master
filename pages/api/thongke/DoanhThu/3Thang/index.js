import connectDB from '../../../../../utils/connectDB'
import Orders from '../../../../../models/orderModel'
import moment from 'moment'

connectDB()

export default async (req, res) => {
    switch(req.method){
        
        case 'GET': 
            await getDataDoanhThu_Month(req, res)
            break;
    }
}

const getDataDoanhThu_Month = async (req, res) => {
    try {
        var curr = new Date(); // get current date

        var thangThuNhat = new Date(curr.getFullYear(), curr.getMonth() - 1, 1);
        var thangThuHai = new Date(curr.getFullYear(), curr.getMonth() - 2, 1);
        var thangThuBa = new Date(curr.getFullYear(), curr.getMonth() - 3, 1);

        var arrDoanhThu = [];

        var result = (await Orders.find()).filter(ord => {
            if(ord.dateOfPayment){
                return ord
            }
        })
        var doanhThu1 = 0;
        var doanhThu2 = 0;
        var doanhThu3 = 0;
        var arrOrderDetail = [];

        for (let index2 = 0; index2 < result.length; index2++) {
            if (thangThuNhat.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuNhat.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                doanhThu1 += result[index2].total;
                arrOrderDetail.push(result[index2])
            }

            if (thangThuHai.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuHai.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                doanhThu2 += result[index2].total;
                arrOrderDetail.push(result[index2])
            }

            if (thangThuBa.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuBa.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                doanhThu3 += result[index2].total;
                arrOrderDetail.push(result[index2])
            }
        }
        arrDoanhThu.push(doanhThu3, doanhThu2, doanhThu1);
        
        var arrDateResult = [];

        var stringThangThuNhat = (thangThuNhat.getMonth() + 1).toString() + '/' + (thangThuNhat.getFullYear()).toString();
        var stringThangThuHai = (thangThuHai.getMonth() + 1).toString() + '/' + (thangThuHai.getFullYear()).toString();
        var stringThangThuBa = (thangThuBa.getMonth() + 1).toString() + '/' + (thangThuBa.getFullYear()).toString();

        arrDateResult.push(stringThangThuBa, stringThangThuHai, stringThangThuNhat);


        res.status(200).json({
            status: 'success',
            data: arrOrderDetail,
            dataDate: arrDateResult,
            dataDoanhThu: arrDoanhThu,
            message: 'Tính doanh thu 3 tháng gần nhất thành công'
        });
        
    } catch (err) {
        return res.status(500).json({err: 'Lấy data doanh thu 3 tháng gần nhất thất bại'})
    }
}

