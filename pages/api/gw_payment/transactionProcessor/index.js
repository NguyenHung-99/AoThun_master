const uuid = require('uuid');
const crypto = require('crypto');
const https = require('https');

export default async (req, res) => {
    switch(req.method){
        case 'POST': 
            await ThemDonHang_MOMO(req, res)
            break;
        
    }
}


    const  ThemDonHang_MOMO = (req,res) => {
        const {name, email, sdt, diachi, phuongxa, quanhuyen, tinhtp, total} = req.body
        var partnerCode = "MOMOAYO220210615";
        var accessKey = process.env.ACCESS_KEY_MOMO;
        var serectkey = process.env.SECRET_KEY_MOMO;
        var orderInfo = `HT_Store : Thanh toán hóa đơn`;
        var returnUrl = `${process.env.BASE_URL}/resultOrder?name=${name}&email=${email}&sdt=${sdt}&diachi=${diachi}&phuongxa=${phuongxa}&quanhuyen=${quanhuyen}&tinhtp=${tinhtp}&total=${total}`;
        var notifyurl = `${process.env.BASE_URL}/resultOrder?name=${name}&email=${email}&sdt=${sdt}&diachi=${diachi}&phuongxa=${phuongxa}&quanhuyen=${quanhuyen}&tinhtp=${tinhtp}&total=${total}`;
        
        var amount = req.body.amount;
        var orderId = uuid.v1();;
        var requestId = uuid.v1();
        var requestType = "captureMoMoWallet";
        var extraData = "merchantName=;merchantId=";

        var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData;

        var signature = crypto.createHmac('sha256', serectkey).update(rawSignature).digest('hex');

        var body = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            returnUrl: returnUrl,
            notifyUrl: notifyurl,
            extraData: extraData,
            requestType: requestType,
            signature: signature
        })

        var options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/gw_payment/transactionProcessor',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        var result;

        var request = https.request(options, (ress) => {
            ress.setEncoding('utf8');
            ress.on('data', (body) => {
                result += body;
            });
            ress.on('end', () => {
                
                res.status(200).json({
                    status: 'success',
                    data: result.toString().substring(216, 520)
                });
            });
        });

        request.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        request.write(body);
        request.end();


    }
