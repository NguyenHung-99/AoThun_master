import Head from 'next/head'
import {useContext, useState} from 'react'
import { updateItem } from '../store/Actions'
import {DataContext} from '../store/GlobalState'
import { postData, putData } from '../utils/fetchData'

const Categories = () => {
    const [state, dispatch] = useContext(DataContext)
    const {auth, categories} = state
    const [categoryName, setCategoryName] = useState('')
    const [categoryDescription, setCategoryDescription] = useState('')
    const [id, setId] = useState('')

    const createCategory = async() => {
        if(auth.user.role !== 'admin')
        return dispatch({type: 'NOTIFY', payload: {error: 'Tài khoản không được cấp quyền.'}})

        if(!categoryName) return dispatch({type: 'NOTIFY', payload: {error: 'Tên loại sản phẩm không được để trống.'}})
        if(!categoryDescription) return dispatch({type: 'NOTIFY', payload: {error: 'Mô tả loại sản phẩm không được để trống.'}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        let res;
        if(id){
            res = await putData(`categories/${id}`, {categoryName, categoryDescription}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
            dispatch(updateItem(categories, id, res.category, 'ADD_CATEGORIES'))
            

        }else{
            res = await postData('categories', {categoryName,categoryDescription}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
            dispatch({type: "ADD_CATEGORIES", payload: [...categories, res.newCategory]}) 
        }
        setCategoryName('')
        setCategoryDescription('')
        setId('')
        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }

    const handleEditCategory = (category) => {
        setId(category._id)
        setCategoryName(category.categoryName)
        setCategoryDescription(category.categoryDescription)
    }

    return (
        <div className="col-md-6 mx-auto my-3" style={{marginLeft: '10%', marginRight:'10%'}}>
            <Head>
                <title>Categories</title>
            </Head>


            <div className="form-label-group">
                <input type="text" className="form-control" placeholder="Add a new category" value={categoryName} onChange={e => setCategoryName(e.target.value)}/>
                <label htmlFor="inputEmail">Tên</label>
            </div>
            <div className="form-label-group">
                <input type="text" className="form-control" placeholder="Add a new category" value={categoryDescription} onChange={e => setCategoryDescription(e.target.value)}/>
                <label htmlFor="inputEmail">Mô Tả</label>
            </div>
            <div className="input-group mb-3">
            <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit" onClick={createCategory}>{id ? "Update" : "Create"}</button>
                
            </div>

            {
                 categories.map(catogory => (
                    <div key={catogory._id} className="card my-2 text-capitalize">
                        <div className="card-body d-flex justify-content-between">
                            {catogory.categoryName}: {catogory.categoryDescription}

                            <div style={{cursor: 'pointer'}}>
                                <i className="fas fa-edit mr-2 text-info"
                                onClick={() => handleEditCategory(catogory)}></i>

                                <i className="fas fa-trash-alt text-danger"
                                data-toggle="modal" data-target="#exampleModal"
                                onClick={() => dispatch({
                                    type: 'ADD_MODAL',
                                    payload: [{ 
                                        data: categories, id: catogory._id, title: catogory.categoryName, type: 'ADD_CATEGORIES' 
                                    }]
                                })} ></i>
                            </div>

                        </div>
                    </div>
                ))
            }
        
       
    </div>
    )
}
export default Categories