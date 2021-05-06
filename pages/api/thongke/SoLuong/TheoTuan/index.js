import connectDB from '../../../../../utils/connectDB'
import Orders from '../../../../../models/orderModel'
import moment from 'moment'

connectDB()

export default async (req, res) => {
    switch(req.method){
        
        case 'GET': 
            await getDataSoLuong_Week(req, res)
            break;
    }
}
// so luong ban ra trong tuan
const getDataSoLuong_Week = async (req, res) => {
    try {
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week

        var firstday = new Date(curr.setDate(first));


        var arrDate = [];
        var arrSanLuong = [];

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
            var sanLuong = 0;
        
            for (let index2 = 0; index2 < result.length; index2++) {
                
               if (Number(arrDate[index1].getDate()) === Number(moment(result[index2].dateOfPayment).format('DD')) &&
                Number(arrDate[index1].getMonth() + 1) === Number(moment(result[index2].dateOfPayment).format('MM')) &&
                Number(arrDate[index1].getFullYear()) === Number(moment(result[index2].dateOfPayment).format('yyyy'))) {
                    result[index2].cart.map(it => sanLuong += it.quantity) 
                }
            }
          
            arrSanLuong.push(sanLuong);
           
        }
      
        var arrDateResult = [];

        for (let index = 0; index < arrDate.length; index++) {
            var stringDate = (arrDate[index].getDate()) + '/' + (arrDate[index].getMonth() + 1) + '/' + arrDate[index].getFullYear();
            arrDateResult.push(stringDate);
        }

        res.status(200).json({
            status: 'success',
            dataDate: arrDateResult,
            dataSanLuong: arrSanLuong,
            message: 'Tính sản lượng tuần này thành công'
        });
        
    } catch (err) {
        return res.status(500).json({err: 'Lấy data sản lượng tuần này thất bại'})
    }
}

