import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import { DataContext } from '../store/GlobalState'

import {Bar} from 'react-chartjs-2'
import moment from 'moment';
import {useRouter} from 'next/router'
const report = () =>{
    const [state] = useContext(DataContext)
    const { orders} = state
    orders.map(order =>{
        console.log(moment(order.createdAt).format("YYYY")+"moment(order.createdAt).format(YYYY)")
    })
    const router = useRouter()
    const reportLabels = moment.months();
    const total = [0,0,0,0,0,0,0,0,0,0,0,0]
    orders.map(order =>{
        switch (moment(order.createdAt).format('MM')) {
            case '01':
                total[0] =  total[0] + order.total
                break;
            case '02':
                total[1] =  total[1] + order.total
                break;
            case '03':
                total[2] =  total[2] + order.total
                break;
             case '04':
                total[3] =  total[3] + order.total
                break;   
            case '05':
                total[4] =  total[4] + order.total
                break;
            case '06':
                total[5] =  total[5] + order.total
                break;     
            case '07':
                total[6] =  total[6] + order.total
                break; 
            case '08':
                total[7] =  total[7] + order.total
                break;
            case '09':
                total[8] =  total[8] + order.total
                break;    
            case '10':
                total[9] =  total[9] + order.total
                break;   
             case '11':
                total[10] =  total[10] + order.total
                break;   
            case '12':
                total[11] =  total[11] + order.total
                break;                           
            default:
                break;
        }
    })

    const onSalesClick =()=>{
        return(
            <div>sdfsdf</div>
        )
    }
       
    

    return(
       
        <div >
             <Head>
                <title>
                    Report
                </title>
            </Head>
           
        <div className="wrapper">
		<div className="row">
			<div className="col-3 col-md-3 col-sm-6">
				<div className="counter bg-success" onClick={onSalesClick}>
                   
                    <p>
                    <i className="far fa-chart-bar"></i>
					</p>
					<h3>Sales</h3>
                    
					
				</div>
			</div>
			<div className="col-3 col-md-3 col-sm-6">
				<div className="counter bg-danger">
					<p>
                    <i className="fas fa-shopping-cart"></i>
					</p>
					<h3>Orders</h3>
					
				</div>
			</div>
			<div className="col-3 col-md-3 col-sm-6">
				<div className="counter bg-info">
					<p>
						<i className="fas fa-check-circle"></i>
					</p>
					<h3>Customer</h3>
				</div>
			</div>
			<div className="col-3 col-md-3 col-sm-6">
				<div className="counter bg-secondary">
					<p>
						<i className="fas fa-bug"></i>
					</p>
					<h3>Complaint</h3>
				</div>
			</div>
		</div>
		<div className="row">
			<div className="col-8 col-md-8 col-sm-12">
				<div className="card">
					<div className="card-header">
                  
                    <table>
                        <h3>Stats Report</h3>
								<tr className="row">
									<th className="col-md-6">order ID</th>
									<th className="col-md-3">Customer</th>
									<th className="col-md-1">Delivery</th>
									<th className="col-md-2">Paid</th>
								</tr>
                   </table>
					</div>
                   
                    {/* dfsdfd */}
                    {/* asdasd */}
					<div className="card-content-y">
						<table>
							<tbody>
                                {
                                    orders.map(order => (
                                        <tr key={order._id}>
                                           
                                            <td >
                                                <Link href={`/order/${order._id}`}>
                                                    {order._id}
                                                </Link>
                                                
                                            </td>
                                            <td  >
                                                {order.user.ten}
                                            </td>
                                           
                                            <td  >
                                                {
                                                    order.delivered
                                                    ? <i className="fas fa-check text-success"></i>
                                                    : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                            <td>
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
			<div className="col-4 col-md-4 col-sm-12">
				<div className="card">
					<div className="card-header">
						<h3>
							Progress bar
						</h3>
						<i className="fas fa-ellipsis-h"></i>
					</div>
					<div className="card-content">
						<div className="progress-wrapper">
							<p>
								Less than 1 hour
								<span className="float-right">50%</span>
							</p>
							<div className="progress">
								<div className="bg-success" style={{width: '50%'}}></div>
							</div>
						</div>
						<div className="progress-wrapper">
							<p>
								1 - 3 hours
								<span className="float-right">60%</span>
							</p>
							<div className="progress">
								<div className="bg-primary" style={{width: '60%'}}></div>
							</div>
						</div>
						<div className="progress-wrapper">
							<p>
								More than 3 hours
								<span className="float-right">40%</span>
							</p>
							<div className="progress">
								<div className="bg-warning" style={{width: '40%'}}></div>
							</div>
						</div>
						<div className="progress-wrapper">
							<p>
								More than 6 hours
								<span className="float-right">20%</span>
							</p>
							<div className="progress">
								<div className="bg-danger" style={{width: '20%'}}></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div className="row">
			<div className="col-12 col-m-12 col-sm-12">
				<div className="card">
					<div className="card-header">
						<h3>
							Chart
						</h3>
					</div>
					
                    <div className='row'>
                <div className="col-md-12">

                
                    <Bar
                        data={{
                            labels: reportLabels,
                            datasets:[
                                {
                                    label: 'Profit',
                                    data:total,
                                    backgroundColor: 'rgba(255,99,133,0.6)',
                                    labels:{
                                        color:'rgb(255,99,132)'   
                                    },
                                    position:'right'
                                
                                }
                            ]
                        }}
                        options={{
                            onClick: (event, elements) => {
                                console.log(elements)
                                if(elements.length > 0){
                                    const xLabel = elements[0].index
                                    console.log(xLabel)
                                    return router.push(`DetailOrderMonth/${xLabel+1}`);
                                }
                            }
                        }}
                    />
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