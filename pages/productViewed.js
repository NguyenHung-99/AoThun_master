import { useContext, useEffect, useState} from "react";
import ProductItem from "../components/product/ProductItem";
import { DataContext } from "../store/GlobalState";
import { getData } from "../utils/fetchData";
import Head from 'next/head'

const productViewed = () => {
    const [state, dispatch] = useContext(DataContext)
    const {auth} = state
    const [dataProductsViewed, setDataProductsViewed] = useState([])

    
    useEffect(() => {
        if(auth.token){
            const LayDataSanPhamDaXemTheoIDUser = async() => {
                
                let res = await getData('product/productsViewed', auth.token);
                if (res.status == 'Success') {
                    setDataProductsViewed(res.data);
                } else {
                    dispatch({ type: 'NOTIFY', payload: {error: res.err} })
                }
            }
            LayDataSanPhamDaXemTheoIDUser()
        }
       
    }, [auth.token]);

    if(!auth.token) return null

    return (
        <div className="home_page" style={{marginLeft:'10%', marginRight:'10%'}}>

        <Head>
            <title>Products Viewed</title>
        </Head>

        <div className="products">
            {
            dataProductsViewed.length === 0
            ? <h2>No Product</h2>
            :
            dataProductsViewed.map(product =>(
            <ProductItem key={product._id} product={product}/>

            ))
            } 
        </div> 
        </div>  
    )
}
export default productViewed