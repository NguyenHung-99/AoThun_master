import Link from 'next/link'
import {useContext, useState,useEffect} from 'react'
import {DataContext} from '../../store/GlobalState'
import {addToCart} from '../../store/Actions'
import {Notified} from '../../store/Actions'
import { putData } from '../../utils/fetchData'


const ProductItem = ({product, handleCheck}) => {

    const [state, dispatch] = useContext(DataContext)
    const {cart, auth} = state
    
    const handleSubmit = () => {
        dispatch(Notified())
        dispatch(addToCart(product, cart, 'S'))
    }
    const handleUpdate_UserView = async() => {
        if(auth.user){
            let res = await putData(`product`, {idProduct: product._id}, auth.token)
        };
    }
    
   
    const userLink = () => {
        return(
            <>
               <a href={`product/${product._id}`} className="btn btn-info"style={{marginRight: '5px', flex: 1}} onClick={handleUpdate_UserView}>
                   Xem
                </a>                
                <button className="btn btn-success"
                style={{marginLeft: '5px', flex: 1}}
                disabled={product.inStock === 0 ? true : false} 
                onClick={handleSubmit} >
                    Mua Ngay
                </button>
            </>
        )
    }
    const adminLink = () => {
        return(
            <>
                <a href={`product/${product._id}`} className="btn btn-success"style={{marginRight: '5px', flex: 1}} onClick={handleUpdate_UserView}>
                   Xem
                </a> 
                <Link href={`create/${product._id}`}>
                    <a className="btn btn-info"
                    style={{flex: 1}}>Sửa</a>
                </Link>
                <button className="btn btn-danger"
                style={{marginLeft: '5px', flex: 1}}
                data-toggle="modal" data-target="#exampleModal"
                onClick={() => dispatch({
                    type: 'ADD_MODAL',
                    payload: [{ 
                        data: '', id: product._id, 
                        title: product.title, type: 'DELETE_PRODUCT' 
                    }]
                })} >
                    Xóa
                </button>
            </>
        )
    }
   
    return (
        
        <div className="card" style={{ width: '18rem' }}>
            {
                auth.user && auth.user.role === 'admin' &&
                <input type="checkbox" checked={product.checked}
                className="position-absolute"
                style={{height: '20px', width: '20px'}}
                onChange={() => handleCheck(product._id)} /> 
            }
        
        <img className="card-img-top" src={product.images[0].url} alt={product.images[0].url} />
        <div className="card-body">
            <h5 className="card-title text-capitalize" title={product.title}>
                {product.title}
            </h5>

            <div className="row justify-content-between mx-0">
                <h6 className="text-danger">{product.price} ₫</h6>
                {
                    product.inStock > 0
                    ? <h6 className="text-danger">Kho: {product.inStock}</h6>
                    : <h6 className="text-danger">Hết hàng</h6>
                }
            </div>

            <p className="card-text" title={product.description}>
                {product.description}
            </p>
                
            <div className="row justify-content-between mx-0">
                 {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
            </div>
        </div>
    </div>
    )
}
export default ProductItem