import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import SalesChart from '../components/SalesChart'

const report = () =>{
    const [state] = useContext(DataContext)
    const {users, orders} = state
    const sale = 0
    const [totalSale, setTotalSale] = useState(0)
	const [totalOrder,setTotalOrder] = useState(0)
	const [totalCustomer,setTotalCustomer] = useState(0)
	
	useEffect(()=>{
        const getTotalSale = () => {
            const res = orders.reduce((prev, order) => {
              return prev + (order.total + sale)
            },0)
      
            setTotalSale(res)
          }
      
          getTotalSale()
    },[orders])

	useEffect(()=>{
        const getTotalSOrder = () => {
            const res = orders.reduce((prev) => {
              return prev + 1
            },0)
      
            setTotalOrder(res)
          }
      
          getTotalSOrder()
    },[orders])

	useEffect(()=>{
        const getTotalCustomer = () => {
            const res = users.reduce((prev) => {
              return prev + 1
            },0)
      
            setTotalCustomer(res)
          }
      
          getTotalCustomer()
    },[users])
	


    return(
       
        <div >
             <Head>
                <title>
                    Report
                </title>
            </Head>
           
        <div class="wrapper">
		<div class="row">
			<div class="col-3 col-md-3 col-sm-6">
				<div class="counter bg-success" >
                   
                    <p>
                    <i class="far fa-chart-bar"></i>
					</p>
					<h3>Income</h3>
					<span>${totalSale}</span>
				</div>
			</div>
			<div class="col-3 col-md-3 col-sm-6">
				<div class="counter bg-danger">
					<p>
                    <i class="fas fa-shopping-cart"></i>
					</p>
					<h3>Orders</h3>
					<span>{totalOrder} (Đơn)</span>
				</div>
			</div>
			<div class="col-3 col-md-3 col-sm-6">
				<div class="counter bg-info">
					<p>
					<i class="fas fa-users"></i>
					</p>
					<h3>Customer</h3>
					<span>{totalCustomer} (Thành viên)</span>
				</div>
			</div>
			<div class="col-3 col-md-3 col-sm-6">
				<div class="counter bg-secondary">
					<p>
						<i class="fas fa-bug"></i>
					</p>
					<h3>View</h3>
					<span>2342343</span>
				</div>
			</div>
		</div>
		<div class="row">
			
			<div class="col-8 col-md-8 col-sm-8">
				<div class="card">
					<div class="card-header">
                  
                    <table>
					<div className="row card-nav">
							<div className="col-10 col-md-10 col-ms-10">
								
								<h3>Stats</h3>
							</div>
							<div className="col-2 col-md-2 col-ms-3">
								<Link href="/profile">
								<button>See All       
											<span style={{paddingLeft:'5px'}}><i class="fas fa-arrow-right"></i></span>
								</button>		
								</Link>
							</div>
						</div>
								
                   </table>
					</div>
                   
                    {/* dfsdfd */}
                    {/* asdasd */}
					<div class="card-content-y">
						<table>
							<tbody>
                                {
                                    orders.map(order => (
                                        <tr className="row" key={order._id}>
                                           
                                            <td className="col-md-4">
                                                <Link href={`/order/${order._id}`}>
                                                    {order._id}
                                                </Link>
                                                
                                            </td>
                                            <td  className="col-md-3">
                                                {order.user.ten}
                                            </td>
                                            <td  className="col-md-3">
                                                {new Date(order.createdAt).toLocaleDateString()}
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
					<div class="card-header">
					<table>
					<tr className="row">
									<th className="col-md-4">order ID</th>
									<th className="col-md-3">Customer</th>
                                    <th className="col-md-3">Date</th>
									<th className="col-md-1">Delivery</th>
									<th className="col-md-1">Paid</th>
								</tr>
								</table>
								</div>
				</div>
			</div>
			<div class="col-4 col-md-4 col-sm-4">
			<div class="card">
					<div class="card-header">
                  
                    <table>
						<div className="row card-nav">
							<div className="col-9 col-md-9 col-ms-10"><h3>Customers</h3></div>
							<div className="col-3 col-md-3 col-ms-3">
								<Link href="/users">
								<button>See All       
											<span style={{paddingLeft:'5px'}}><i class="fas fa-arrow-right"></i></span>
								</button>		
								</Link>
							</div>
						</div>
                        
						
                   </table>
					</div>
                   
                   
					<div class="card-content-y">
						<table>
							<tbody>
                                {
                                    users.map(user => (
                                        <tr className="row" key={user._id}>
                                           <td className="col-md-1"></td>
                                            <td className="col-md-2">
                                                
												<img src={user.anhDaiDien} alt={user.anhDaiDien}
													style={{
														width: '30px', height: '30px', 
														overflow: 'hidden', objectFit: 'cover'
													}} />
                                                
                                                
                                            </td>
                                            <td  className="col-md-7">
                                                {user.ten}
                                            </td>
                                            <td  className="col-md-2 ">
												<Link href={`/edit_user/${user._id}`}>
													<i class="fas fa-edit text-info"></i>
												</Link>
                                            </td>
                                            
                                        </tr> 
                                    ))
                                }
							</tbody>
						</table>
					</div>

				</div>
							
			</div>
		</div>
		<div class="row">
			<div class="col-12 col-m-12 col-sm-12">
				<div class="card">
					<div class="card-header">
						<h3>
							Chart
						</h3>
					</div>
					
                    <div className='row'>
                        <div className="col-md-6"></div>
                        <route></route>
                <div className="col-md-6">

                                <SalesChart></SalesChart>
                    
                </div>
				</div>
			</div>
		</div>
	</div>
            </div>
        </div>
        
    )
}
export default report;