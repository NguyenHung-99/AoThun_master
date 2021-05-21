import { getData } from "../../utils/fetchData"
import {useState, useContext, useEffect} from 'react'
import Head from 'next/head'
import ProductItem from '../../components/product/ProductItem'
import { DataContext } from '../../store/GlobalState'
import filterSearch from '../../utils/filterSearch'
import {useRouter} from 'next/router'
import Filter from '../../components/Filter'

const categoryID = (props) => {
  const [products, setProducts] = useState(props.products)
  const [isCheck, setIsCheck] = useState(false)
  const [state, dispatch] = useContext(DataContext)
  const {auth} = state
  const [page, setPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    setProducts(props.products)
  },[props.products])
  
  useEffect(() => {
    if(Object.keys(router.query).length === 0) setPage(1)
  },[router.query])
 

  const handleCheck = (id) => {
    products.forEach(product => {
      if(product._id === id) product.checked = !product.checked
    })
    setProducts([...products])
  }

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach(product => {
      if(product.checked){
          deleteArr.push({
            data: '', 
            id: product._id, 
            title: 'Delete all selected products?', 
            type: 'DELETE_PRODUCT'
          })
      }
    })
    
    dispatch({type: 'ADD_MODAL', payload: deleteArr})


  }
  const handleCheckALL = () => {
    products.forEach(product => {
      product.checked = !product.checked
    })
    setProducts([...products])
    setIsCheck(!isCheck)
  }
  const handleLoadmore = () => {
    setPage(page + 1)
    filterSearch({router, page: page + 1})
    
  }

  return (
    <div className="home_page" style={{marginLeft:'10%', marginRight:'10%'}}>

      <Head>
        <title>{props.categoryName}</title>
      </Head>
      <Filter state={state} />
      {
        auth.user && auth.user.role === 'admin' &&
        <div className="delete_all btn btn-danger mt-2" style={{marginBottom: '-10px'}}>
          <input type="checkbox" checked={isCheck} onChange={handleCheckALL}
            style={{width: '25px', height: '25px', transform: 'translateY(8px)'}} />

          <button className="btn btn-danger ml-2" data-toggle="modal" data-target="#exampleModal" onClick={handleDeleteAll}>
            DELETE ALL
          </button>
        </div>
      }

      <div className="products">
        {
          products.length === 0
          ? <h2>No Product</h2>
          :
          products.map(product =>(
          <ProductItem key={product._id} product={product} handleCheck={handleCheck} />

          ))

        }
        
      </div>
      {
        props.result < page * 8 ? ""
        : <button className="btn btn-outline-info d-block mx-auto mb-4"
        onClick={handleLoadmore}>
          Load more
        </button>
      }
     
    </div>

  )
}


export async function getServerSideProps({query}) {
    const getCategory = await getData(`categories/${query.categoryID[0]}`)
    
    const page = query.page || 1
    const category = query.category || query.categoryID[0]
    const sort = query.sort || ''
    const search = query.search || 'all'
   
    const res = await getData(
      `product?limit=${page * 8}&category=${category}&sort=${sort}&title=${search}`
    )
    
      return {
        props: {
          products: res.products,
          result: res.result,
          categoryName: getCategory.category.categoryName
        }, // will be passed to the page component as props
      }
  }
export default categoryID