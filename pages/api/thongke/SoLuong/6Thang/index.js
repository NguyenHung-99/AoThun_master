import connectDB from '../../../../../utils/connectDB'
import Orders from '../../../../../models/orderModel'


connectDB()

export default async (req, res) => {
    switch(req.method){
        
        case 'GET': 
            await getDataProduct_6Month(req, res)
            break;
    }
}

const getDataProduct_6Month = async (req, res) => {
    try {
        var curr = new Date(); // get current date

        var thangThuNhat = new Date(curr.getFullYear(), curr.getMonth() - 1, 1);
        var thangThuHai = new Date(curr.getFullYear(), curr.getMonth() - 2, 1);
        var thangThuBa = new Date(curr.getFullYear(), curr.getMonth() - 3, 1);
        var thangThuTu = new Date(curr.getFullYear(), curr.getMonth() - 4, 1);
        var thangThuNam = new Date(curr.getFullYear(), curr.getMonth() - 5, 1);
        var thangThuSau = new Date(curr.getFullYear(), curr.getMonth() - 6, 1);

        var arrOders = [];

        var result = (await Orders.find().populate("user")).filter(ord => {
            if(ord.dateOfPayment){
                return ord
            }
        })
        var outStock1 = 0;
        var outStock2 = 0;
        var outStock3 = 0;
        var outStock4 = 0;
        var doanhThu5 = 0;
        var outStock6 = 0;
        let arrOrderDetail = [];

        for (let index2 = 0; index2 < result.length; index2++) {
            if (thangThuNhat.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuNhat.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                result[index2].cart.map(it => outStock1 += it.quantity)
                arrOrderDetail.push(result[index2]);
            }

            if (thangThuHai.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuHai.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                    result[index2].cart.map(it => outStock2 += it.quantity)
                arrOrderDetail.push(result[index2]);
            }

            if (thangThuBa.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuBa.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                    result[index2].cart.map(it => outStock3 += it.quantity)
                arrOrderDetail.push(result[index2]);
            }

            if (thangThuTu.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuTu.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                result[index2].cart.map(it => outStock4 += it.quantity)
                arrOrderDetail.push(result[index2]);
            }

            if (thangThuNam.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuNam.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                result[index2].cart.map(it => doanhThu5 += it.quantity)
                arrOrderDetail.push(result[index2]);
            }

            if (thangThuSau.getMonth() === result[index2].dateOfPayment.getMonth() &&
                thangThuSau.getFullYear() === result[index2].dateOfPayment.getFullYear()) {
                result[index2].cart.map(it => outStock6 += it.quantity)
                arrOrderDetail.push(result[index2]);
            }
        }
        arrOders.push(outStock6, doanhThu5, outStock4, outStock3, outStock2, outStock1);
 
        var arrDateResult = [];

        var stringThangThuNhat = (thangThuNhat.getMonth() + 1).toString() + '/' + (thangThuNhat.getFullYear()).toString();
        var stringThangThuHai = (thangThuHai.getMonth() + 1).toString() + '/' + (thangThuHai.getFullYear()).toString();
        var stringThangThuBa = (thangThuBa.getMonth() + 1).toString() + '/' + (thangThuBa.getFullYear()).toString();
        var stringThangThuTu = (thangThuTu.getMonth() + 1).toString() + '/' + (thangThuTu.getFullYear()).toString();
        var stringThangThuNam = (thangThuNam.getMonth() + 1).toString() + '/' + (thangThuNam.getFullYear()).toString();
        var stringThangThuSau = (thangThuSau.getMonth() + 1).toString() + '/' + (thangThuSau.getFullYear()).toString();


        arrDateResult.push(stringThangThuSau, stringThangThuNam, stringThangThuTu, stringThangThuBa, stringThangThuHai, stringThangThuNhat);

        res.status(200).json({
            status: 'success',
            data: arrOrderDetail,
            dataDate: arrDateResult,
            dataProduct: arrOders,
            message: 'Tính số sản phẩm 6 tháng gần nhất thành công'
        });
        
    } catch (err) {
        return res.status(500).json({err: 'Lấy data số sản phẩm 6 tháng gần nhất thất bại'})
    }
}

