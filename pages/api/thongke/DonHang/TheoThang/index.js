import connectDB from '../../../../../utils/connectDB'
import Orders from '../../../../../models/orderModel'
import moment from 'moment'

connectDB()

export default async (req, res) => {
    switch(req.method){
        
        case 'GET': 
            await getDataOrder_Month(req, res)
            break;
    }
}

const getDataOrder_Month = async (req, res) => {
    try {
        var curr = new Date(); // get current date
        var soNgayTrongThang = daysInMonth(curr.getMonth() + 1, curr.getFullYear());
        var firstDateOfMonth = new Date(curr.getFullYear(), curr.getMonth(), 1);

        var arrDate = [];
        var arrOrder = [];
        var arrOrderDetail = [];

        for (let index = 1; index <= soNgayTrongThang; index++) {
            var dateThem = new Date(firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(), index);
            arrDate.push(dateThem);
        }
        
        var result = (await Orders.find().populate("user")).filter(ord => {
            if(ord.dateOfPayment){
                return ord
            }
        })
       

        for (let index1 = 0; index1 < arrDate.length; index1++) {
            var soDonHang = 0;
        
            for (let index2 = 0; index2 < result.length; index2++) {
                


               if (Number(arrDate[index1].getDate()) === Number(moment(result[index2].dateOfPayment).format('DD')) &&
                Number(arrDate[index1].getMonth() + 1) === Number(moment(result[index2].dateOfPayment).format('MM')) &&
                Number(arrDate[index1].getFullYear()) === Number(moment(result[index2].dateOfPayment).format('yyyy'))) {
                    soDonHang += 1;
                    arrOrderDetail.push(result[index2]);
                }
            }
            
            arrOrder.push(soDonHang);
           
        }
      
        var arrDateResult = [];

        for (let index = 0; index < arrDate.length; index++) {
            var stringDate = (arrDate[index].getDate()) + '/' + (arrDate[index].getMonth() + 1);
            arrDateResult.push(stringDate);
        }

        res.status(200).json({
            status: 'success',
            data: arrOrderDetail,
            dataDate: arrDateResult,
            dataSoDonHang: arrOrder,
            message: 'Tính số đơn hàng tuần này thành công'
        });
        
    } catch (err) {
        return res.status(500).json({err: 'Lấy data số đơn hàng tuần này thất bại'})
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
