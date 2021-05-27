import Head from 'next/head'
import {useState, useContext, useEffect} from 'react'
import {DataContext} from '../../store/GlobalState'
import { getData, postData, putData } from '../../utils/fetchData'
import {ImageUpload} from '../../utils/ImageUpload'
import {useRouter} from 'next/router'

const createProduct = () => {
    const initialState = {
        title: '',
        price: 0,
        inStock: 0,
        description: '',
        content: '',
        size: [{Size: 'S', InStock_Size: 0 , sold: 0},{Size: 'M', InStock_Size: 0, sold: 0}, {Size: 'L', InStock_Size: 0, sold: 0}],
        category: ''
    }
    const [product, setProduct] = useState(initialState)
    const {title, price, inStock, size, description, content, category} = product
    
    const [state, dispatch] = useContext(DataContext)
    const {auth , categories} = state

    const [images, setImages] = useState([])
    const [InStock_SizeS, setInStock_SizeS] = useState(0)
    const [InStock_SizeM, setInStock_SizeM] = useState(0)
    const [InStock_SizeL, setInStock_SizeL] = useState(0)

    const router = useRouter()
    const {id} = router.query
    const [onEdit, setOnEdit] = useState(false)
    

    useEffect(() => {
        if(id){
            setOnEdit(true)
            getData(`product/${id}`).then(res => {
                setProduct(res.product)
                setImages(res.product.images)
                setInStock_SizeS(res.product.size[0].InStock_Size)
                setInStock_SizeM(res.product.size[1].InStock_Size)
                setInStock_SizeL(res.product.size[2].InStock_Size)
            })
        }else{
            setOnEdit(false)
            setProduct(initialState)
            setImages([])
        }
    }, [id]);
    const handleSubmit = async(e) => {
        // không chuyển trang
        e.preventDefault()
        if(auth.user.role !== 'admin')
            return dispatch({type: 'NOTIFY', payload: {error: 'Tài khoản không hợp lệ!'}})
        if(!title || !price || size.length === 0 || !description || !content || category === 'all' || images.length === 0)
            return dispatch({type: 'NOTIFY', payload: {error: 'Vui lòng nhập đủ thông tin.'}})
        dispatch({type: 'NOTIFY', payload: {loading: true}})
        let media = []
        //chưa có url
        const imgNewURL = images.filter(img => !img.url)
        //đã có url
        const imgOldURL = images.filter(img => img.url)
       
        if(imgNewURL.length > 0) media = await ImageUpload(imgNewURL)
        
        size[0].InStock_Size = parseInt(InStock_SizeS)
        size[1].InStock_Size = parseInt(InStock_SizeM)
        size[2].InStock_Size = parseInt(InStock_SizeL)
        const count =  parseInt(InStock_SizeS) + parseInt(InStock_SizeM) + parseInt(InStock_SizeL);
        let res;
        if(onEdit){
            res = await putData(`product/${id}`, {...product,inStock: count, images: [...imgOldURL, ...media]}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        }else{
            res = await postData('product', {...product,inStock: count, images: [...imgOldURL, ...media]}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        }
        setProduct(initialState)
        setImages([])
        setInStock_SizeS(0)
        setInStock_SizeM(0)
        setInStock_SizeL(0)
        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})

       
    }
    const handleChangeInput = e => {
        const {name, value} = e.target
        setProduct({...product, [name]:value})
        dispatch({type: 'NOTIFY', payload: {}})
    }
    const handleUploadInput = e => {
        dispatch({type: "NOTIFY", payload: {}})
        let newImages = []
        let num = 0
        let err = ''
        let files = [...e.target.files]

        if(files.length === 0)
        return dispatch({type: "NOTIFY", payload: {error: 'Vui lòng chọn ảnh.'}})

        files.forEach(file => {
            if(file.size > 1024*1024)
                return err = 'IMG lớn hơn 1MB.'
                
            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return err = 'Định dạng file không hợp lệ. Vui lòng chọn *.png hoặc *.jpeg'

            num =+ 1;
            if(num <= 5) newImages.push(file)
            return newImages
        })

        if(err) return dispatch({type: 'NOTIFY', payload: {error: err}})

        const imgCount = images.length
        if(imgCount + newImages.length > 5)
        return dispatch({type: 'NOTIFY', payload: {error: 'Vui lòng chọn tối đa 5 hình ảnh.'}})
        setImages([...images, ...newImages])

    }
    const deleteImage = index => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    if(!auth.user || auth.user.role !== 'admin') return null
    return (
        <div className="page-wrapper font-poppins" style={{backgroundColor:'whitesmoke'}}>

    <Head>
        <title>Liên Hệ</title>
    </Head>
    <div className="wrapper wrapper--w750">
        <div className="card card-4">
            <div className="card-body">
                
                <div className="col-sm-12">

                <div className="products_manager" style={{marginLeft:'5%', marginRight:'5%'}}>
            
            <Head>
                <title>Products Manager</title>
            </Head>
            <h1 style={{textAlign:'center'}}><b>PRODUCTS MANAGER</b></h1>
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    
                    <input type="text" name="title" value={title}
                    placeholder="Title" style={{border:'groove'}} className="d-block my-4 w-100 p-2"
                    onChange={handleChangeInput} />

                    <div className="row">
                        <div className="col-sm-12">
                            <label htmlFor="price">Price</label>
                            <input type="number" name="price" value={price}
                            placeholder="Price" style={{border:'groove'}} className="d-block w-100 p-2"
                            onChange={handleChangeInput} />
                        </div>  
                    </div>
                    <br/>
                    <hr style={{backgroundColor:'gray'}}/>
                    <h3 style={{textAlign:'center'}}>Size</h3>
                    <div className="row">
                        
                        <div className="col-sm-4">
                            <label htmlFor="price">S</label>
                            <input type="number" name="InStock_SizeS" style={{border:'groove'}} value={InStock_SizeS}
                            placeholder="InStock" className="d-block w-100 p-2"
                            onChange={e => setInStock_SizeS(e.target.value)}/>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="price">M</label>
                            <input type="number" name="InStock_SizeM" style={{border:'groove'}} value={InStock_SizeM}
                            placeholder="InStock" className="d-block w-100 p-2"
                            onChange={e => setInStock_SizeM(e.target.value)} />
                        </div>
                        <div className="col-sm-4">
                            <label htmlFor="price">L</label>
                            <input type="number" name="InStock_SizeL" style={{border:'groove'}} value={InStock_SizeL}
                            placeholder="inStock" className="d-block w-100 p-2"
                            onChange={e => setInStock_SizeL(e.target.value)} />
                        </div>
                    </div>
                    <br/>
                    <hr style={{backgroundColor:'gray'}}/>

                    <textarea name="description" id="description" cols="30" rows="4"
                    placeholder="Description" onChange={handleChangeInput}
                    className="d-block my-4 w-100 p-2" value={description} />

                    <textarea name="content" id="content" cols="30" rows="6"
                    placeholder="Content" onChange={handleChangeInput}
                    className="d-block my-4 w-100 p-2" value={content} />

                    <div className="input-group-prepend px-0 my-2">
                        <select name="category" id="category" value={category}
                        onChange={handleChangeInput} className="custom-select text-capitalize">
                            <option value="all">All Categories</option>
                            {
                                categories.map(item => (
                                    <option key={item._id} value={item._id}>
                                        {item.categoryName}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <button type="submit" className="btn btn-info my-2 px-4">
                        {onEdit ? 'Update': 'Create'}
                    </button>

                </div>

                <div className="col-md-6 my-4">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file border rounded">
                            <input type="file" className="custom-file-input"
                            onChange={handleUploadInput} multiple accept="image/*" />
                        </div>

                    </div> 

                    <div className="row img-up mx-0">
                        {
                            images.map((img, index) => (
                                <div key={index} className="file_img my-1">
                                    <img src={img.url ? img.url : URL.createObjectURL(img)}
                                     alt="" className="img-thumbnail rounded" />

                                     <span onClick={() => deleteImage(index)}>X</span>
                                </div>
                            ))
                        }
                    </div>
                        

                </div>

               
            </form>

            
        </div>          

                </div>
            </div>
        </div>
    </div>
</div>

       
    )
}
export default createProduct