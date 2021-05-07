import React, { useState } from 'react'
import Head from 'next/head'
import ThongKe from '../components/ThongKe'
import {useContext} from 'react'
import { DataContext } from '../store/GlobalState'
import Statistical from '../components/Statistical'


const report = () => {
	const [state, dispatch] = useContext(DataContext)
	const {auth} = state
	const [showAbout, setShowAbout] = useState(false)

	const handleClick = () => {
		return setShowAbout(true)
	}
	if(!auth.user) return null
	
	return(
		
	<div className="">
	
		<Head>
			<title>
				Report
			</title>
		</Head>
	
		<div className="wrapper">
			<div className="row">
				<div className="col-md-3">
					<div className="report-sidebar">
						<div className="report-sidebar-brand">
							<h1 style={{paddingTop:'15px'}}><span>Admin</span></h1>
						</div>
						<div className="report-sidebar-menu">
							<ul>
								<li>
									<a href="" className="active "><i className="fas fa-clipboard-list  text-success "
											style={{paddingLeft:'15px'}}></i>
										<span style={{paddingLeft:'5px'}}>Dashboard</span>
									</a>
								</li>
								<li>
									<a className=" "><i className="fas fa-user " style={{paddingLeft:'15px'}}></i>
										<span style={{paddingLeft:'5px'}}  onClick={handleClick}>Users</span>
									</a>
								</li>
								<li>
									<a href="" className=""><i className="fas fa-tshirt " style={{paddingLeft:'15px'}}></i>
										<span style={{paddingLeft:'5px'}}>Create Products</span>
									</a>
								</li>
								<li>
									<a href="" className=" "><i className="fas fa-list" style={{paddingLeft:'15px'}}></i>
										<span style={{paddingLeft:'5px'}}>Create Categories</span>
									</a>
								</li>
								<li>

									<a href="" className=" "><i className="fas fa-sign-out-alt "
											style={{paddingLeft:'15px'}}></i>
										<span style={{paddingLeft:'5px'}}>Logout</span>
									</a>
								</li>
							</ul>
						</div>
					</div>

				</div>
				<div className="col-md-9">
				{/* { showAbout ? <ThongKe ></ThongKe> : <ThongKe ></ThongKe> } */}
					<Statistical/>
					</div>
			</div>
		</div>
	</div>

	)
	
}
export default report;