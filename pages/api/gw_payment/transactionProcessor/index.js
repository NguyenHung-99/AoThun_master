import { postData } from '../../../../utils/fetchData';

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
        var partnerCode = "MOMO83IR20210509";
        var accessKey = process.env.ACCESS_KEY_MOMO;
        var serectkey = process.env.SECRET_KEY_MOMO;
        var orderInfo = `HT_Store : Thanh toán hóa đơn ${req.body.orderInfo}`;
        var returnUrl = `${process.env.BASE_URL}/order/${req.body.orderInfo}`;
        var notifyurl = `${process.env.BASE_URL}/order/momo/${req.body.orderInfo}`;
        
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
                
                
                postData(`order/momo/${req.body.orderInfo}`,{paymentId: orderId}, req.body.auth.token);
                
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
