import React from 'react'

import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'

import SalesChart from './SalesChart'
import { getData } from '../utils/fetchData'
import { DataContext } from '../store/GlobalState'

const ThongKe = () => {
    const [state, dispatch] = useContext(DataContext)
    
    const {users, orders} = state
    const sale = 0
    const [totalSale, setTotalSale] = useState(0)
    const [totalProduct,setTotalProduct] = useState(0)


    useEffect(()=>{
        const getTotalSale = () => {
        const res = orders.reduce((prev, order) => {
        return prev + (order.total + sale)
        },0)

        setTotalSale(res)
        }

        getTotalSale()
    },[orders])

    useEffect(async() => {
        const category ='all'
        const search = 'all'

        const res = await getData(`product?category=${category}&title=${search}`)
        setTotalProduct(res.result)

    }, []);


    return (
       <>
        <div className="row">
					<div className="col-3 col-md-3 col-sm-6">
						<div className="counter bg-success">

							<p>
								<i className="far fa-chart-bar"></i>
							</p>
							<h3>Income</h3>
							<span>${totalSale}</span>
						</div>
					</div>
					<div className="col-3 col-md-3 col-sm-6">
						<div className="counter bg-danger">
							<p>
								<i className="fas fa-shopping-cart"></i>
							</p>
							<h3>Orders</h3>
							<span>{orders.length} (Đơn)</span>
						</div>
					</div>
					<div className="col-3 col-md-3 col-sm-6">
						<div className="counter bg-info">
							<p>
								<i className="fas fa-users"></i>
							</p>
							<h3>Customer</h3>
							<span>{users.length} (Thành viên)</span>
						</div>
					</div>
					<div className="col-3 col-md-3 col-sm-6">
						<div className="counter bg-secondary">
							<p>
								<i className="fas fa-bug"></i>
							</p>
							<h3>Products</h3>
							<span>{totalProduct} (Sản Phẩm)</span>
						</div>
					</div>
				</div>
				
                <div className="row">
			
			<div className="col-8 col-md-8 col-sm-8">
				<div className="card">
					<div className="card-header">
                  
                    <table>
					<div className="row card-nav">
							<div className="col-10 col-md-9 col-ms-10">
								
								<h3>Stats</h3>
							</div>
							<div className="col-2 col-md-2 col-ms-3">
								<Link href="/profile">
								<button>See All       
											<span style={{paddingLeft:'5px'}}><i className="fas fa-arrow-right"></i></span>
								</button>		
								</Link>
							</div>
						</div>
								
                   </table>
					</div>
                 
					<div className="card-content-y">
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
					<div className="card-header">
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
			<div className="col-4 col-md-4 col-sm-4">
			<div className="card">
					<div className="card-header">
                  
                    <table>
						<div className="row card-nav">
							<div className="col-9 col-md-7 col-ms-10"><h3>Customers</h3></div>
							<div className="col-3 col-md-5 col-ms-3">
								<Link href="/users">
								<button>See All       
											<span style={{paddingLeft:'5px'}}><i className="fas fa-arrow-right"></i></span>
								</button>		
								</Link>
							</div>
						</div>
                        
						
                   </table>
					</div>
                   
                   
					<div className="card-content-y">
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
													<i className="fas fa-edit text-info"></i>
												</Link>
                                            </td>
                                            
                                        </tr> 
                                    ))
                                }
							</tbody>
						</table>
					</div>

				</div>
						<div className="row">
					</div>
			</div>
            </div>
                <div className="col-12 col-m-12 col-sm-12">
						<div className="card">
							<div className="card-header">
								<h3>
									Chart
								</h3>
							</div>
							<SalesChart></SalesChart>
						</div>
				</div>
			

			
       </>
    )
}
export default ThongKe