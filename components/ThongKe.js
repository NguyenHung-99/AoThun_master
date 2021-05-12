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
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
						<div className="counter bg-success">

							<p>
								<i className="far fa-chart-bar"></i>
							</p>
							<h3>Income</h3>
							<span>${totalSale}</span>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
						<div className="counter bg-danger">
							<p>
								<i className="fas fa-shopping-cart"></i>
							</p>
							<h3>Orders</h3>
							<span>{orders.length} (Đơn)</span>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
						<div className="counter bg-info">
							<p>
								<i className="fas fa-users"></i>
							</p>
							<h3>Customer</h3>
							<span>{users.length} (Thành viên)</span>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
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
				
			<div className="col-xs-12 col-sm-12 col-md-6 col-lg-8">
				<div className="card">
					<div className="card-header">
                  
             
					<div className=" card-nav">
							<div >
								
								<h3>Stats</h3>
							</div>
							<div>
								<Link href="/profile">
								<button >See All       
											<span > <i className="fas fa-arrow-right"></i></span>
								</button>		
								</Link>
							</div>
						</div>
			
					</div>
                 
					<div className="card-content-y">
						<table>
							<tbody>
                                {
                                    orders.map(order => (
                                        <tr className="row" key={order._id}>
                                           
                                            <td className="col-3">
                                                <Link href={`/order/${order._id}`}>
                                                    {order._id}
                                                </Link>
                                                
                                            </td>
                                            <td  className="col-3">
                                                {order.user.ten}
                                            </td>
                                            <td  className="col-2">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td  className="col-2">
                                                {
                                                    order.delivered
                                                    ? <i className="fas fa-check text-success"></i>
                                                    : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                            <td className="col-2">
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
						<thead>
							<tr className="row">
								<th className="col-3">order ID</th>
								<th className="col-3">Customer</th>
                                <th className="col-2">Date</th>
								<th className="col-2">Delivery</th>
								<th className="col-2">Paid</th>
							</tr>
						</thead>
					
					</table>
					</div>
				</div>
			</div>
			<div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
			<div className="card">
					<div className="card-header">
                  
                
						<div className=" card-nav">
							<div className=""><h3>Customers</h3></div>
							<div className="">
								<Link href="/users">
								<button >See All       
											<span > <i className="fas fa-arrow-right"></i></span>
								</button>		
								</Link>
							</div>
						</div>
                 
					</div>
                   
                   
					<div className="card-content-y">
						<table className="table table-rounded">
							<tbody>
                                {
                                    users.map(user => (
                                        <tr className="row" key={user._id}>
                                            <td className="col-2">
                                                
												<img src={user.anhDaiDien} alt={user.anhDaiDien}
													style={{
														width: '30px', height: '30px', 
														overflow: 'hidden', objectFit: 'cover'
													}} />
                                                
                                                
                                            </td>
                                            <td  className="col-7">
                                                {user.ten}
                                            </td>
                                            <td  className="col-2 ">
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
			</div>
            </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
						<div className="card">
					<div className="card-header">
						<div className="row">
							<div className="col-5 col-md-5 col-xs-5">
								<h3>
									Chart
								</h3>
							</div>
							<div className="col-7 col-md-7 col-xs-7 ">
								<select  className="form-select w-25" aria-label="Default select example">
								<option className="" value="1">2019</option>
									<option value="2">2020</option>
									<option value="3">2021</option>
								</select>
							</div>
						</div>
					</div>
							<SalesChart></SalesChart>
						</div>
				</div>
			

			
       </>
    )
}
export default ThongKe