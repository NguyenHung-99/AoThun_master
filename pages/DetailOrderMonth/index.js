import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import {DataContext} from '../../store/GlobalState'
import {useRouter} from 'next/router'
import moment from 'moment';
import {Line } from 'react-chartjs-2'
import { getData } from '../../utils/fetchData';

import Link from 'next/link'

const DetailOrder = () => {

    const [state, dispatch] = useContext(DataContext)
    const {orders, auth} = state
    const router = useRouter()
    const [orderList, setOrderList] = useState([])
    const [arrLabel, setArrLabel] = useState([])
    const [arrData, setArrData] = useState([])
    const [arrCountOrder, setarrCountOrder] = useState([])

    const [orderByMonth, setorderByMonth] = useState([])
    const [totalSaleOfMonth,setTotalSaleOfMonth] = useState(0)
   
    var sale = 0
    useEffect(()=>{
        const getTotalSale = () => {
            const res = orderByMonth.reduce((prev, order) => {
            
            return prev + order.total
            
        },0)
        
        setTotalSaleOfMonth(res)
        }

        getTotalSale()
    }, [orderByMonth])
    
    useEffect(() => {
        
    const orderByMonth = orders.filter(order => {
        if (order.dateOfPayment && Number(moment(order.dateOfPayment).format('MM')) === Number(router.query.month)) {
    
              return order
        }
    })
    setorderByMonth(orderByMonth) 

    },orders)
     
       
    //get day in month
    useEffect(async() => {
        const month = router.query.month
        const year = router.query.year
        const res = await getData(`thongke/${month}/${year}`);
        setArrLabel(res.arrResult)
        setArrData(res.arrDoanhThu)
        setarrCountOrder(res.arrCountOrder)
    }, [router]);
    
    
    
    // render layout
    if (!auth.user) return null
    return (
        <div>
        <Head>
            <title>Detail Orders Month</title>
            </Head>
            <div>
                <button style={{marginTop:'15px'}} className="btn btn-dark" onClick={() => router.back()}>
                    <i className="fas fa-long-arrow-alt-left" aria-hidden></i> Go Back
                </button>
            </div>
            <div style={{ textAlign: 'center'}}>
            <span style={{Size:'50px', border:'solid', padding:'15px'}} className="bg-info text-light">Chi Tiết Sale Tháng {router.query.month} </span>

            </div>
            <div className="row">
                <div className="col-4 col-md-4 col-xs-4">
                    <div className="content" style={{marginTop:'50px'}}>
                        <div className="counter-header bg-danger">
                            <div className="row">
                                <div className="col-md-6">
                                      <span style={{fontSize:'25px'}}>{totalSaleOfMonth}</span>
                                    <h3>$ Income</h3>
							      
                                </div>

                                <div className="col-md-6">
                                    <p>
                                        <i className="fas fa-hand-holding-usd"></i>
                                    </p>
                                </div>
                            </div>
							
							
                        </div>
                    </div>   
                     <div className="content" >
                        <div className="counter-header bg-success">
                             <div className="row">
                                <div className="col-md-6">
                                    <span style={{fontSize:'25px'}}>{arrCountOrder[0]}</span>
                                     <h3>Orders  (Đơn)</h3>
							
							      
                                </div>
                                
                                <div className="col-md-6">
                                    <p>
                                        <i className="fas fa-shopping-cart"></i>
                                    </p>
                                </div>
                            </div>
							
							
						</div>
                    </div>
                    
                </div>  
                    
                <div className="col-8 col-md-8 col-xs-8">
                     <Line
                        data={{
                            labels: arrLabel,
                            datasets:[
                                {
                                    label: 'Sales',
                                    data: arrData,
                                    borderColor: "#8e5ea2",
                                
                                }
                            ],
                            
                        }}
                        
                    />
                </div>
                
        </div>
         <div className="card">
					<div className="card-header">
					<table> 
                        <tr className="row" >
                                <th className="col-md-1">#</th>
                            <th className="col-md-2">order ID</th>
                            <th className="col-md-3">Customer</th>
                            <th className="col-md-2">Date</th>
                            <th className="col-md-1">Date Order</th>
                            <th className="col-md-1">Date Payment</th>
									<th className="col-md-1">Delivery</th>
									<th className="col-md-1">Paid</th>
								</tr>
								</table>
                        </div>
                        <div className="card-content-y">
						<table className="table table-striped ">
							<tbody>
                                {
                                    orderByMonth.map((order,index) => (
                                        <tr className="row" key={order._id}>
                                           <td className="col-md-1">
                                                    {index+1}
                                                
                                            </td>
                                            <td className="col-md-2">
                                                 <Link href={`/order/${order._id}`}>
                                                    {order._id}
                                                </Link>
                                                
                                            </td>
                                            <td className="col-md-3">
                                                <img src ={order.user.anhDaiDien} style={{width:'25px'}}></img>
                                                    {order.user.ten}
                                                
                                            </td>
                                             <td  className="col-md-2">
                                                  {order.total}
                                            </td>
                                            <td  className="col-md-1">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td  className="col-md-1">
                                                {new Date(order.dateOfPayment).toLocaleDateString()}
                                            </td>
                                            <td  className="col-md-1">
                                                {
                                                    order.delivered
                                                    ? <i className="fas fa-check text-success"></i>
                                                    : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                            <td className="col-md-1">
                                                {
                                                    order.paid
                                                    ? <i className="fas fa-check text-success"></i>
                                                    : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                        </tr> 
                                    ))
                                }
							</tbody>
						</table>
						
					</div>
                    </div>
    </div>
    )
}
export default DetailOrder