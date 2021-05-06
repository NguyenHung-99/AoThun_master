import connectDB from '../../../../../utils/connectDB'
import Orders from '../../../../../models/orderModel'
import moment from 'moment'

connectDB()

export default async (req, res) => {
    switch(req.method){
        
        case 'GET': 
            await getDataDoanhThu_Week(req, res)
            break;
    }
}

const getDataDoanhThu_Week = async (req, res) => {
    try {
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week

        var firstday = new Date(curr.setDate(first));

        var arrDate = [];
        var arrDoanhThu = [];
        var arrOrderDetail = [];

        for (let index = 0; index <= 7; index++) {
            var dateThem = new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate() + index);
            if (dateThem >= firstday) {
                arrDate.push(dateThem);
            }
        }

        var result = (await Orders.find()).filter(ord => {
            if(ord.dateOfPayment){
                return ord
            }
        })
       

        for (let index1 = 0; index1 < arrDate.length; index1++) {
            var doanhThu = 0;
        
            for (let index2 = 0; index2 < result.length; index2++) {
                


               if (Number(arrDate[index1].getDate()) === Number(moment(result[index2].dateOfPayment).format('DD')) &&
                Number(arrDate[index1].getMonth() + 1) === Number(moment(result[index2].dateOfPayment).format('MM')) &&
                Number(arrDate[index1].getFullYear()) === Number(moment(result[index2].dateOfPayment).format('yyyy'))) {
                    doanhThu += result[index2].total;
                    arrOrderDetail.push(result[index2]);
                   
                }
            }
            
            arrDoanhThu.push(doanhThu);
           
        }
      
        var arrDateResult = [];

        for (let index = 0; index < arrDate.length; index++) {
            var stringDate = (arrDate[index].getDate()) + '/' + (arrDate[index].getMonth() + 1) + '/' + arrDate[index].getFullYear();
            arrDateResult.push(stringDate);
        }

        res.status(200).json({
            status: 'success',
            data: arrOrderDetail,
            dataDate: arrDateResult,
            dataDoanhThu: arrDoanhThu,
            message: 'Tính lợi nhuận tuần này thành công'
        });
        
    } catch (err) {
        return res.status(500).json({err: 'Lấy data doanh thu tuần này thất bại'})
    }
}

