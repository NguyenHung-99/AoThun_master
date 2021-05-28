import Link from 'next/link'
import Head from 'next/head'
import {useState, useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import {getData } from '../utils/fetchData';
import {useRouter} from 'next/router'


const findOrder = () => {
    const initialState = { orderID: ''};

    const [userData,setUserData] = useState(initialState)
    const {orderID } = userData

    const [state, dispatch] = useContext(DataContext)
    const {auth} = state
    const router = useRouter()
    const [resultOrder, setResultOrder] = useState(null)

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }
    const handleSubmit = async e =>{
        //ko load lai trang
        e.preventDefault()
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        
        const res = await getData(`order/${orderID}`)
        if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        dispatch({ type: 'NOTIFY', payload: {success: res.message} })
        return setResultOrder(res.order)  
    }
    if(resultOrder){
        return (
            <>
            <div style={{marginLeft:'15%', marginTop: '20px'}}>
                    <button className="btn btn-dark" onClick={() => router.back()}>
                        <i className="fas fa-long-arrow-alt-left"  aria-hidden="true"></i> Go Back
                    </button>
                </div>
                <div style={{margin: '20px auto'}} className="row justify-content-around">
                <Head>
                    <title>Order {resultOrder._id}</title>
                </Head>
                

                    <div className="text-uppercase my-3" style={{maxWidth: '600px'}}>
                        <h1 className="text-break"><b>Order {resultOrder._id}</b></h1>
                        <hr/>
                        <div className="mt-4 text-secondary">
                            <h2 style={{textAlign:'center'}}><b>Shipping</b></h2>
                            <br/>
                            <p><b>Name:</b> {resultOrder.user.ten}</p>
                            <p><b>Email:</b> {resultOrder.user.email}</p>
                            <p><b>Address:</b> {resultOrder.address}</p>
                            <p><b>Mobile:</b> {resultOrder.mobile}</p>
                            <br/>
                            <div className={`alert ${resultOrder.delivered === 'Đã giao hàng' ? 'alert-success' : 'alert-danger'}
                            d-flex justify-content-between align-items-center`} role="alert">
                                
                                {
                                    resultOrder.delivered === 'Đã giao hàng' ? `Deliverd on ${resultOrder.updatedAt}` : resultOrder.delivered
                                }
                                
                            </div>
                            <hr/>
                            <h2 style={{textAlign:'center'}}><b>Payment</b></h2>
                            <br/>
                            {
                                resultOrder.method && <h6><b>Method:</b> <em>{resultOrder.method}</em></h6>
                            }
                            
                            {
                                resultOrder.paymentId && <p><b>PaymentId:</b> <em>{resultOrder.paymentId}</em></p>
                            }
                            <br/>
                            <div className={`alert ${resultOrder.paid ? 'alert-success' : 'alert-danger'}
                            d-flex justify-content-between align-items-center`} role="alert">
                                {
                                    resultOrder.paid ? `Paid on ${resultOrder.dateOfPayment}` : 'Not Paid'
                                }
                                
                            </div>
                            <hr/>
                            <div>
                                <h2 style={{textAlign:'center'}}><b>Order Items</b></h2>
                                <br/>
                                {
                                    resultOrder.cart.map((item, index) => (
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
                                                {item.quantity} x ${item.price} = ${item.price * item.quantity}
                                            </span>

                                        </div>
                                    ))
                                }
                            </div>

                        </div>

                    </div>


                    </div>

            </>
            
        )
    }
    
    return (
        <div className='signin'>
        <Head>
            <title>Find Order</title>
        </Head>
        <div className='body'>
        <div className="container">
            <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card card-signin my-5">
                <div className="card-body">
                    <h5 className="card-title text-center">Find Order</h5>
                    <form className="form-signin" onSubmit={handleSubmit}>
                    <div className="form-label-group">
                        <input type="text" id="inputOrderID" name="orderID" value={orderID} onChange={handleChangeInput} className="form-control" placeholder="Email address" autoFocus/>
                        <label htmlFor="inputOrderID">Your order ID</label>
                    </div>

                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Find</button>
                                    
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}
export default findOrder