import Link from 'next/link'
import { patchData } from '../utils/fetchData'
import { updateItem } from '../store/Actions'
import moment from 'moment';

const OrderDetail = ({orderDetail, state, dispatch}) => {
    const {auth, orders} = state
    const handleDelivered = (order, delivere) => {
        dispatch({type: 'NOTIFY', payload: {loading: true}})
        
        patchData(`order/delivered/${order._id}`, {delivere} , auth.token).then(res=>{
            if(res.err) return  dispatch({type: 'NOTIFY', payload: {error: res.err}})
            
            const { paid, dateOfPayment, method, delivered } = res.result

            dispatch(updateItem(orders, order._id, {...order, paid, dateOfPayment, method, delivered}, 'ADD_ORDERS'))
            return  dispatch({type: 'NOTIFY', payload: {success: res.msg}})
        })
        
    }
   
    return (
        <>
            {
            orderDetail.map(order => (
            <div key={order._id} style={{margin: '20px auto'}} className="row justify-content-around">

                <div className="text-uppercase my-3" style={{maxWidth: '600px'}}>
                    <h1 className="text-break"><b>Đơn hàng {order._id}</b></h1>
                    <hr/>
                    <div className="mt-4 text-secondary">
                        <h2 style={{textAlign:'center'}}><b>Shipping</b></h2>
                        <br/>
                        <p><b>Tên:</b> {order.user.ten}</p>
                        <p><b>Email:</b> {order.user.email}</p>
                        <p><b>Địa chỉ:</b> {order.address}</p>
                        <p><b>Số điện thoại:</b> {order.mobile}</p>
                        <br/>
                        <div className={`alert ${order.delivered === 'Đã giao hàng' ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`} role="alert">
                            {
                                order.delivered === 'Đã giao hàng' ? `Đã giao hàng vào ${moment(order.updatedAt).format('DD/MM/yyyy')}` : order.delivered
                            }
                            {
                                order.delivered === 'Đã hoàn tiền' && ` vào ${moment(order.updatedAt).format('DD/MM/yyyy')}`
                            }
                            {
                                order.delivered === 'Đã hủy đơn hàng. Đã hoàn tiền' && ` vào ${moment(order.updatedAt).format('DD/MM/yyyy')}`
                            }
                            {/* user */}
                            {
                                auth.user.role === 'user' && order.delivered === 'Chờ xác nhận' &&
                                <button className="btn btn-dark text-uppercase"
                                onClick={(e) => {
                                    const delivere = e.target.value
                                    handleDelivered(order, delivere)
                                }} value="Đã hủy đơn hàng">
                                    Hủy đơn hàng
                                </button>
                            }
                            {
                                auth.user.role === 'user' && order.delivered === 'Chờ lấy hàng' &&
                                <button className="btn btn-dark text-uppercase"
                                onClick={(e) => {
                                    const delivere = e.target.value
                                    handleDelivered(order, delivere)
                                }} value="Đã hủy đơn hàng">
                                    Hủy đơn hàng
                                </button>
                            }
                            {/* admin */}
                            {
                                auth.user.role === 'admin' && order.delivered === 'Chờ xác nhận' &&
                                <button className="btn btn-dark text-uppercase"
                                onClick={(e) => {
                                    const delivere = e.target.value
                                    handleDelivered(order, delivere)
                                }} value="Chờ lấy hàng">
                                    Xác nhận Đơn hàng
                                </button>
                            }
                            {
                                auth.user.role === 'admin' && order.delivered === 'Chờ lấy hàng' &&
                                <button className="btn btn-dark text-uppercase"
                                onClick={(e) => {
                                    const delivere = e.target.value
                                    handleDelivered(order, delivere)
                                }} value="Đang giao hàng">
                                    Đã lấy hàng
                                </button>
                            }
                            {
                                auth.user.role === 'admin' && order.paid && order.delivered === 'Hủy đơn hàng: Giao hàng không thành công vì đúng địa chỉ không có người nhận hàng' &&
                                
                                <button className="btn btn-dark text-uppercase"
                                onClick={(e) => {
                                    const delivere = e.target.value
                                    handleDelivered(order, delivere)
                                }} value="Đã hoàn tiền">
                                    Hoàn tiền
                                </button>    
                            }   
                            {
                                auth.user.role === 'admin' && order.paid && order.delivered === 'Hủy đơn hàng: Giao hàng không thành công vì sai địa chỉ nhận hàng' &&
                                
                                <button className="btn btn-dark text-uppercase"
                                onClick={(e) => {
                                    const delivere = e.target.value
                                    handleDelivered(order, delivere)
                                }} value="Đã hoàn tiền">
                                    Hoàn tiền
                                </button>    
                            } 
                            {
                                auth.user.role === 'admin' && order.delivered === 'Đang giao hàng' &&
                                
                                <button className="btn btn-dark text-uppercase"
                                onClick={(e) => {
                                    const delivere = e.target.value
                                    handleDelivered(order, delivere)
                                }} value="Đã giao hàng">
                                    Đã giao hàng
                                </button>    
                            }                                                       
                            {
                                auth.user.role === 'admin' && order.paid && order.delivered === 'Đã hủy đơn hàng' &&
                                
                                <button className="btn btn-dark text-uppercase"
                                onClick={(e) => {
                                    const delivere = e.target.value
                                    handleDelivered(order, delivere)
                                }} value="Đã hủy đơn hàng. Đã hoàn tiền">
                                    Hoàn tiền
                                </button>    
                            } 
                        </div>
                        {
                                auth.user.role === 'admin' && order.delivered === 'Đang giao hàng' &&
                                <div>
                                    
                                    <center><b>Giao hàng không thành công</b></center>
                                    <br/>
                                    <button className="btn btn-dark text-uppercase"
                                    onClick={(e) => {
                                        const delivere = e.target.value
                                        handleDelivered(order, delivere)
                                    }} value="Hủy đơn hàng: Giao hàng không thành công vì đúng địa chỉ không có người nhận hàng">
                                       Không có người nhận hàng
                                    </button>
                                    
                                    <button className="btn btn-dark text-uppercase" style={{float:'right'}}
                                    onClick={(e) => {
                                        const delivere = e.target.value
                                        handleDelivered(order, delivere)
                                    }} value="Hủy đơn hàng: Giao hàng không thành công vì sai địa chỉ nhận hàng">
                                        Sai địa chỉ nhận hàng
                                    </button>
                                </div>
                                
                            }
                            <br/>
                        <hr/>
                        <h2 style={{textAlign:'center'}}><b>Payment</b></h2>
                        <br/>
                        {
                            order.method && <h6><b>Phương thức:</b> <em>{order.method}</em></h6>
                        }
                        
                        {
                            order.paymentId && <p><b>PaymentId:</b> <em>{order.paymentId}</em></p>
                        }
                        <br/>
                        <div className={`alert ${order.paid ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`} role="alert">
                            {
                                order.paid ? `Thanh toán vào ${moment(order.dateOfPayment).format('DD/MM/yyyy')}` : 'Chưa thanh toán'
                            }
                            
                        </div>
                        <hr/>
                        <div>
                            <h2 style={{textAlign:'center'}}><b>Order Items</b></h2>
                            <br/>
                            {
                                order.cart.map((item, index) => (
                                    <div className="row border-bottom mx-0 p-2 justify-content-betwenn
                                    align-items-center" key={index} style={{maxWidth: '550px'}}>
                                        <img src={item.images[0].url} alt={item.images[0].url}
                                        style={{width: '50px', height: '45px', objectFit: 'cover'}} />

                                        <h5 className="flex-fill text-secondary px-3 m-0">
                                            <Link href={`/product/${item._id}`}>
                                                <a>{item.title} <b>{item.sizeSelection}</b></a>
                                            </Link>
                                        </h5>

                                        <span className="text-info m-0">
                                            {item.quantity} x {item.price}₫ = {item.price * item.quantity}₫
                                        </span>

                                    </div>
                                ))
                            }
                        </div>

                    </div>

                </div>
            
               
            </div>
            ))
        }

        </>
    )
}
export default OrderDetail