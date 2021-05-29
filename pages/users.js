import Head from 'next/head'
import {useContext, useEffect, useState} from 'react'
import {DataContext} from '../store/GlobalState'
import Link from 'next/link'
import { getData } from '../utils/fetchData'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'
import filterSearch from '../utils/filterSearch'


const Users = (props) => {
    const [state, dispatch] = useContext(DataContext)
    const {auth, modal} = state

    const [users, setUSers] = useState([])
    const router = useRouter()


    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')

    const handleSort = (e) => {
        setSort(e.target.value)
        filterSearch({router, sort: e.target.value})
    }

    useEffect(() => {
        setUSers(props.users)
      },[props.users])

    useEffect(() => {
        filterSearch({router, search: search ? search.toLowerCase() : 'all'})
    },[search])

    useEffect(() => {
        const updateRole = async () => {
            let usersList = []
            await getData(`user?sort=${''}&title=${'all'}`, auth.token).then(res =>{
                if(res.err) return dispatch({type: 'NOTIFY' , payload: {err: res.err}})
                for(const item of res.users){
                    usersList.push(item)
                }
                dispatch({type: 'ADD_USERS' , payload: usersList})
            })
        }
        updateRole()
        
    }, []);
    
        
    if(!auth.user || auth.user.role === 'user') return null
    return (
        <div style={{marginLeft:'10%', marginRight:'10%', marginTop: '20px', marginBottom: '20px'}}>
            <Head>
                <title>Quản lý người dùng</title>
            </Head>
            <h1 style={{textAlign:'center'}}><b>USERS</b></h1>
            <br/>
            <div className='row' style={{marginLeft:'70%'}}>
            <form autoComplete="off" className="mt-2 col-md-8 px-0">
                <div className="form-label-group">
                    <input type="text" id="txtSearch" className="form-control" value={search.toLowerCase()} onChange={e => setSearch(e.target.value)} placeholder="Search" autoFocus/>
                    <label htmlFor="txtSearch">Tìm kiếm</label>
                </div>
               
                
            </form>
            <div className="mt-3 col-md-4">
                <select className="custom-select text-capitalize"
                value={sort} onChange={handleSort}  style={{borderRadius: '40px'}}>

                     <option value="-createdAt">Newest</option>
                     <option value="oldest">Oldest</option>

                </select>
            </div>
                {/* <div className="form-label-group">
                    <input type="text" id="txtSearch" name="txtSearch" value={txtSearch} onChange={handleChangeInput} className="form-control" placeholder="Search" autoFocus/>
                    <label htmlFor="txtSearch">Search</label>
                </div>
                <div className='col-4'>
                <button style={{borderRadius:'40px'}} className="btn btn-lg btn-primary btn-block" type="submit" onClick={handleSearch}>Search</button>
                
                </div> */}
                    

            </div>
            <table className="table w-100">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Nhân viên</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        users.map((user, index)=> (
                            <tr key={user._id} style={{cursor: 'pointer'}}>
                                <th>{index + 1}</th>
                                <th>{user._id}</th>
                                <th>
                                    <img src={user.anhDaiDien} alt={user.anhDaiDien}
                                    style={{
                                        width: '30px', height: '30px', 
                                        overflow: 'hidden', objectFit: 'cover'
                                    }} />
                                </th>
                                <th>{user.ten}</th>
                                <th>{user.email}</th>
                                <th>
                                    {
                                        user.account.phanQuyen === 'admin'
                                        ? user.account.root ? <i className="fas fa-check text-success"> Root</i>
                                                            : <i className="fas fa-check text-success"></i>

                                        :<i className="fas fa-times text-danger"></i>
                                    }
                                </th>
                                <th>
                                    <Link href={
                                        auth.user.root && auth.user.email !== user.email
                                        ? `/edit_user/${user._id}` : '#!'
                                    }>
                                        <a><i className="fas fa-edit text-info mr-2" title="Edit"></i></a>
                                    </Link>

                                    {
                                        auth.user.root && auth.user.email !== user.email
                                        ? <i className="fas fa-trash-alt text-danger ml-2" title="Remove"
                                        data-toggle="modal" data-target="#exampleModal"
                                        onClick={() => dispatch({
                                            type: 'ADD_MODAL',
                                            payload: [{ data: users, id: user._id, title: user.ten, type: 'ADD_USERS' }]
                                        })}></i>
                                        
                                        : <i className="fas fa-trash-alt text-danger ml-2" title="Remove"></i>
                                    }

                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    )
}
export async function getServerSideProps({query}) {

  const sort = query.sort || ''
  const search = query.search || 'all'
 
  const res = await getData(
    `user?sort=${sort}&title=${search}`
  )
    return {
      props: {
        users: res.users,
        result: res.result
      }, // will be passed to the page component as props
    }
}

export default Users