import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import moment from 'moment'

connectDB()



export default async (req, res) => {
    switch(req.method){
        
        case 'GET': 
            await getData_Month(req, res)
            break;
    }
}

const getData_Month = async (req, res) => {
    try {
        const month = req.query.data[0] // get tháng
        const year = req.query.data[1] // năm\

        var orderList = (await Orders.find()).filter(ord => {
            if(ord.dateOfPayment && Number(moment(ord.dateOfPayment).format('MM')) ===  Number(month)){
                return ord;
            }
        })
        console.log(orderList)
        var soNgayTrongThang = daysInMonth(month,  year);
        var firstDateOfMonth = new Date( year,  month - 1, 1);
        
        var arrDate = [];
        var arrResult = [];
        for (let index = 1; index <= soNgayTrongThang; index++) {
            var dateThem = new Date(firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(), index);
             var dateResult = moment(dateThem).format('DD-MM-yyyy')
            arrDate.push(dateThem);
            arrResult.push(dateResult)
        }
    
    //    get data order in day of month 
        var arrDoanhThu = [];
        for (let i = 0; i < arrDate.length; i++) {
            var doanhThu = 0;
            for (let index = 0; index < orderList.length; index++) {
           
                if (Number(arrDate[i].getDate()) === Number(moment(orderList[index].createdAt).format('DD')) &&
                Number(arrDate[i].getMonth() + 1) === Number(moment(orderList[index].createdAt).format('MM')) &&
                Number(arrDate[i].getFullYear()) === Number(moment(orderList[index].createdAt).format('yyyy'))) {
                
                    doanhThu += orderList[index].total;
                    
                }
            }
            arrDoanhThu.push(doanhThu);
            
        }
        
        res.json({
            msg: 'Order thành công! Chúng tôi sẻ liên hệ với bạn để xác nhận đơn hàng.',
            arrDoanhThu,
            arrResult
           
        })
        
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
