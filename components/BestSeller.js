import Head from "next/head"
import Link from 'next/link'
import { useContext, useEffect, useState } from "react";
import { getData } from "../utils/fetchData";
import {DataContext} from '../store/GlobalState'

const BestSeller = () => {
    const [state, dispatch] = useContext(DataContext)
    const {auth} = state
    const [dataBestSeller, setDataBestSeller] = useState([])

    useEffect(async() => {
        const res = await getData(
            `product?limit=${10}&category=${'all'}&title=${'all'}&sort=${'-sold'}`
        )
        var result = res.products.filter(item => {
            if(item.sold > 0){
                return item
            }
        })
        setDataBestSeller(result)
    }, []);

    if(!auth.user || auth.user.role !== "admin") return null
    return (
        <div>
            <Head>
                <title>Best Seller</title>
            </Head>
            <h2>Top 10 Best Seller</h2>
            <hr/>
            <div className="card">
					<div className="card-header">
                        <table> 
                            <tr className="row" >
                                <th className="col-md-1">#</th>
                                <th className="col-md-2">product ID</th>
                                <th className="col-md-3">Name</th>
                                <th className="col-md-2">Price</th>
                                <th className="col-md-2">Catagory</th>
                                <th className="col-md-1">InStock</th>
                                <th className="col-md-1">Sold</th>
                                
                                        
                            </tr>
                        </table>
                    </div>
                    <div className="card-content-y">
						<table className="table table-striped ">
							<tbody>
                                {
                                    dataBestSeller.map((product,index) => (
                                        <tr className="row" key={product._id}>
                                           <td className="col-md-1">
                                                {index+1 === 1 ? <span className="badge badge-pill badge-danger">best seller</span> : <span className="badge badge-pill badge-danger">No {index+1}</span>}
                                                
                                            </td>
                                            <td className="col-md-2">
                                                 <Link href={`/product/${product._id}`}>
                                                    {product._id}
                                                </Link>
                                                
                                            </td>
                                            <td className="col-md-3">
                                                <img src ={product.images[0].url} style={{
                                                    borderRadius: '50%', width: '70px', height: '70px',
                                                    transform: 'translateY(-3px)', marginRight: '3px'}}></img>
                                                    {product.title}
                                                
                                            </td>
                                             <td  className="col-md-2">
                                                  {product.price}
                                            </td>
                                            <td  className="col-md-2">
                                                {product.category.categoryName}
                                            </td>
                                            <td  className="col-md-1">
                                                {product.inStock}
                                            </td>
                                            <td  className="col-md-1">
                                                {product.sold}
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
export default BestSeller