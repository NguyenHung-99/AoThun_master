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

    const imgRef = useRef()
    
    const isActive = (index) => {
        if(tab === index) return " active";
        return ""
    }

    // useEffect(() => {
    //     const images = imgRef.current.children;
    //     for(let i = 0; i < images.length; i ++){
    //         //Xóa backgroud img đã chọn: active: true => false
    //         images[i].className = images[i].className.replace('active', 'img-thumbnail rounded')
    //     }
    //     //hiển thị background img click
    //     images[tab].className = 'img-thumbnail rounded active';
    // },[tab])
    
    //get Size được chọn
    const handleSize = e => {
        setSizeSelection(e.target.value)
    }
    return (
        <div className="row detail_page" style={{marginLeft:'10%', marginRight:'10%', marginBottom: '20px'}}>
            <Head>
                <title>Detail Product</title>
            </Head>

            <div className="col-md-6">
                <img src={ product.images[tab].url } alt={ product.images[tab].url } className="d-block img-thumbnail rounded mt-4 w-100" style={{height: '350px'}} />

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

            <div className="col-md-6 mt-4">
                <h2 className="text-uppercase">{product.title}</h2>
                <h5 className="text-danger">${product.price}</h5>

                <div className="row mx-0 d-flex justify-content-between">
                    {
                        product.inStock > 0
                        ? <h6 className="text-danger">In Stock: {product.inStock}</h6>
                        : <h6 className="text-danger">Out Stock</h6>
                    }

                    <h6 className="text-danger">Sold: {product.sold}</h6>
                </div>
                <div className="my-2">
                
                    <div className="form-check">
                    <input type="radio" className="form-check-input" id="materialGroupExample1" name="groupOfMaterialRadios" value='S' checked={sizeSelection === 'S'} onChange={handleSize}/>
                    <label className="form-check-label small text-uppercase card-link-secondary" htmlFor="materialGroupExample1">Size S</label>
                    </div>


                    <div className="form-check">
                    <input type="radio" className="form-check-input" id="materialGroupExample2" name="groupOfMaterialRadios" value='M' checked={sizeSelection === 'M'} onChange={handleSize}/>
                    <label className="form-check-label small text-uppercase card-link-secondary" htmlFor="materialGroupExample2">Size M</label>
                    </div>

                    <div className="form-check">
                    <input type="radio" className="form-check-input" id="materialGroupExample3" name="groupOfMaterialRadios" value='L' checked={sizeSelection === 'L'} onChange={handleSize}/>
                    <label className="form-check-label small text-uppercase card-link-secondary" htmlFor="materialGroupExample3">Size L</label>
                    </div>
                </div>
                
                <div className="my-2">{product.description}</div>
                <div className="my-2">
                    {product.content}
                </div>
               
                <button type="button" className="btn btn-dark d-block my-3 px-5"
                onClick={() => dispatch(addToCart(product, cart, sizeSelection))} >
                    Buy
                </button>
                  
            </div>
        
        </div>
            
       
    )
}
export async function getServerSideProps({params: {id}}) {
  
    const res = await getData(`product/${id}`)
    return {
      props: {product: res.product}, 
    }
}
export default DetailProduct