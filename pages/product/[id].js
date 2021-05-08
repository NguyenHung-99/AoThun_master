import {useState, useEffect, useRef, useContext} from 'react'
import Head from 'next/head'
import {getData} from '../../utils/fetchData'
import {DataContext} from '../../store/GlobalState'
import {addToCart} from '../../store/Actions'

const DetailProduct = (props) =>{
    const [product] = useState(props.product)
    const [tab, setTab] = useState(0)

    const [state, dispatch] = useContext(DataContext)
    const {cart} = state

    const [sizeSelection, setSizeSelection] = useState('S')

    const [productFeature, setProductFeature] = useState([])

    const imgRef = useRef()
    
    const isActive = (index) => {
        if(tab === index) return " active";
        return ""
    }


    
    return (
        <div className="container single-product"style={{maxWidth:"1500px"}}>
        <div className="row detail_page" >
            <Head>
                <title>Detail Product</title>
            </Head>

            <div className="col">
                <img src={ product.images[tab].url } alt={ product.images[tab].url } className="d-block img-thumbnail rounded mt-4 w-100 h50 " />

                <div className="row mx-0" style={{cursor: 'pointer'}} ref={imgRef}>
                {/* setTab(index) -> hiển thị hình ảnh đã chọn */}
                    {product.images.map((img, index) => (
                        <img key={index} src={img.url} alt={img.url}
                        className={`img-thumbnail rounded + ${isActive(index)}`}
                        style={{height: '80px', width: '20%'}}
                        onClick={() => setTab(index)} />
                    ))}

                </div>
            </div>

            <div className="col">
                <h4 className="text-uppercase">{product.title}</h4>
                <h4 className="text-danger">${product.price}</h4>

                <div className="row mx-0 d-flex justify-content-between">
                    {
                        product.inStock > 0
                        ? <h6 className="text-danger">In Stock: {product.inStock}</h6>
                        : <h6 className="text-danger">Out Stock</h6>
                    }

                    <h6 className="text-danger">Sold: {product.sold}</h6>
                </div>
                <div className="size-container">
                
                    <div className="form-check-product">
                    <a className="form-check-S " style={sizeSelection === 'S' ? {backgroundColor: 'grey'}: null} onClick={()=>{
                        setSizeSelection('S')
                    }}>
                    {/* <input type="radio" className="form-check-input" id="materialGroupExample1" name="groupOfMaterialRadios" value='S' checked={sizeSelection === 'S'} onChange={handleSize}/> */}
                        <label className="form-check-label  text-uppercase-dark" htmlFor="materialGroupExample1" > S</label>
                    </a>
                    <a className="form-check-S" style={sizeSelection === 'M' ? {backgroundColor: 'grey'}: null} onClick={()=>{
                        setSizeSelection('M')
                    }}>
                    {/* <input type="radio" className="form-check-input" id="materialGroupExample2" name="groupOfMaterialRadios" value='M' checked={sizeSelection === 'M'} onChange={handleSize}/> */}
                        <label className="form-check-label small text-uppercase " htmlFor="materialGroupExample2"> M</label>
                    </a>
                    <a className="form-check-S" style={sizeSelection === 'L' ? {backgroundColor: 'grey'}: null} onClick={()=>{
                        setSizeSelection('L')
                    }}>
                    {/* <input type="radio" className="form-check-input" id="materialGroupExample3" name="groupOfMaterialRadios" value='L' checked={sizeSelection === 'L'} onChange={handleSize}/> */}
                        <label className="form-check-label small text-uppercase" htmlFor="materialGroupExample3"> L</label>
                    </a>
                    </div>


                    
                </div>
                
                <div className="content-container">
                    <h3>Giới thiệu <i className="fa fa-indent" aria-hidden></i></h3>
                    <p>{product.content}</p>
                    </div>
               
               
                <button type="button" className="btn btn-dark d-block my-3 px-5"
                onClick={() => dispatch(addToCart(product, cart, sizeSelection))} >
                    Buy
                </button>
                  
                 
            </div>
            </div>
            <div className="description-container">
                    <h3>Mô tả chi tiết <i className="fa fa-indent" aria-hidden></i></h3>
                    <p>{product.description}</p>
                    </div>
            <hr style={{backgroundColor:'gray'}}></hr>
            <div className="small_container">
            <div className="title-product-feature">
                    <h3>Feature Product</h3>
                    </div>
                      <div className="row">
                          {
                              productFeature.map(ite => {
                                <div className="col-4">
                                <img src="/img/product/p4.jpg"></img>
                                <h4>{ite.title}</h4>
                                <div className="rating">
                                    <i className="fa fa-star" aria-hidden></i>
                                    <i className="fa fa-star" aria-hidden></i>
                                    <i className="fa fa-star" aria-hidden></i>
                                    <i className="fa fa-star" aria-hidden></i>
                                    <i className="fa fa-star-0" aria-hidden></i>
                                </div>
                                <p>$50.00</p>
                            </div>
                              })
                          }
                
                        
                      </div>
                  </div>        
                 
                    <hr style={{backgroundColor:'gray'}}></hr>
        </div>
       
    )
}
export async function getServerSideProps({params: {id}}) {
  
    const res = await getData(`product/${id}`)
        return {
        props: {
            product: res.product
        }
    }
}
export default DetailProduct