import Head from 'next/head'
import {useRouter} from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
const crypto = require('crypto');

const resultOrder = () => {
    const router = useRouter()
    const [state, dispatch] = useContext(DataContext)
    const {auth, cart, orders} = state
    const [orderID, setOrderID] = useState('')
    
    const name = router.query.name
    const email = router.query.email
    const sdt = router.query.sdt
    const diachi = router.query.diachi
    const phuongxa = router.query.phuongxa
    const quanhuyen = router.query.quanhuyen
    const tinhtp = router.query.tinhtp
    const total = router.query.total
    const paymentId = router.query.requestId

    var partnerCode = router.query.partnerCode;
    var accessKey = router.query.accessKey;
    var requestId = router.query.requestId;
    var amount = router.query.amount;
    var orderId = router.query.orderId;
    var orderInfo = router.query.orderInfo;
    var orderType = router.query.orderType;
    var transId = router.query.transId;
    var message = router.query.message;
    var localMessage = router.query.localMessage;
    var responseTime = router.query.responseTime;
    var errorCode = router.query.errorCode;
    var payType = router.query.payType;
    var extraData = router.query.extraData;
    var serectkey = process.env.SECRET_KEY_MOMO;
    var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey
         + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId
          + "&orderInfo=" + orderInfo + "&orderType=" + orderType + "&transId=" + transId
          + "&message=" + message + "&localMessage=" + localMessage
          + "&responseTime=" + responseTime + "&errorCode=" + errorCode
          + "&payType=" + payType  + "&extraData=" + extraData
          ; 
    var signature = crypto.createHmac('sha256', serectkey).update(rawSignature).digest('hex');
    
    
    useEffect(() => {
        if(signature == router.query.signature){
            if(errorCode == 0){
                if(cart.length !== 0){
                    postData('order/paymentMomo', {name, email, sdt, diachi, phuongxa, quanhuyen, tinhtp, total, cart, paymentId}, auth.token).then(res => {
                        //Thất bại => err
                        if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
                        //Thành công => xóa cart
                        dispatch({ type: 'ADD_CART', payload: [] })
                        const newOrders = {
                            ...res.newOrders,
                            user: auth.user
                        }
                        setOrderID(res.newOrders._id)
                        dispatch({type: 'ADD_ORDERS', payload: [...orders, newOrders] })
                    })
                }   
            }
        }       

    }, [auth.user]);
       
    if(!auth.user) return null
    return(
        <div className="font-poppins" style={{backgroundColor:'whitesmoke'}}>

        <Head>
            <title>{signature == router.query.signature && router.query.errorCode == 0 ? 'Thank You' : 'Error'} - HTStore</title>
        </Head>
        <div className="wrapper wrapper--w750">
            <div className="card card-4">
                <div className="card-body">
                    <center>
                        <h1>Thanh Toán {signature == router.query.signature && router.query.errorCode == 0 ? 'Thành Công' : 'Thất Bại'}</h1>
                    </center>
    
                    <div className="col-sm-12">
                        <br/>
                        {
                            signature == router.query.signature && router.query.errorCode != 0 
                            && <div>
                                <p style={{textAlign:'center', color:'red'}} data-mce-style="text-align: center;"><span>{router.query.localMessage}</span><br /></p><br/>
                                <center><a className="btn btn-lg btn-primary text-uppercase" style={{borderRadius:'30px'}} href='/'>Quay lại trang chủ</a></center>
                                
                            </div> 
                             
                        }
                        {
                            signature == router.query.signature && router.query.errorCode == 0
                            && <div>
                                <p>
                                    <img src="https://res.cloudinary.com/nguyenhungdev/image/upload/v1622554325/aothun_media/thankyou_bo1tyh.jpg"
                                        data-mce-src="https://res.cloudinary.com/nguyenhungdev/image/upload/v1622554325/aothun_media/thankyou_bo1tyh.jpg"
                                        style={{display:'block', marginLeft:'auto', marginRight:'auto', width: '150px', height: '150px', borderRadius: '500px'}}
                                        data-mce-style="display: block; margin-left: auto; margin-right: auto;" />
                                </p><br/>
                                
                                <p style={{textAlign:'center'}} data-mce-style="text-align: center;"><span>Cảm ơn bạn đã mua hàng tại <b><a href='/'>HT-Store</a></b></span><br /></p><br/>
                                <p style={{textAlign:'center'}} data-mce-style="text-align: center;"><span>Mã đơn hàng của bạn là: <b><a href="#">#{orderID}</a></b></span><br /></p><br/>
                                <p style={{textAlign:'center'}} data-mce-style="text-align: center;"><span>Bạn sẽ sớm nhận được email xác nhận của chúng tôi.</span><br /></p><br/>
                                <center><a className="btn btn-lg btn-primary text-uppercase" style={{borderRadius:'30px'}} href='/collection'>Tiếp tục mua sắm</a></center><br/>
                                <center><a href="/">Quay lại trang chủ</a></center>
                            </div>
                        }
                        {
                            signature != router.query.signature
                            && <div>
                                <p style={{textAlign:'center', color:'red'}} data-mce-style="text-align: center;"><h3>Request không hợp lệ.</h3><br /></p><br/>
                                
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    )
    
}
export default resultOrder