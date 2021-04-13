import Head from 'next/head'
import {useContext, useEffect} from 'react'
import {DataContext} from '../store/GlobalState'
import Link from 'next/link'
import { getData } from '../utils/fetchData'

const Users = () => {
    const [state, dispatch] = useContext(DataContext)
    const {auth, users, modal} = state
    
    useEffect(() => {
        const updateRole = async () => {
            let usersList = []
            await getData('user', auth.token).then(res =>{
                if(res.err) return dispatch({type: 'NOTIFY' , payload: {err: res.err}})
                for(const item of res.users){
                    usersList.push(item)
                }
                dispatch({type: 'ADD_USERS' , payload: usersList})
            })
        }
        updateRole()
        
    }, []);
        
    if(!auth.user) return null
    return (
        <div style={{marginLeft:'10%', marginRight:'10%', marginTop: '20px', marginBottom: '20px'}}>
            <Head>
                <title>Users</title>
            </Head>
            <h1 style={{textAlign:'center'}}><b>USERS</b></h1>
            <br/>
            <table className="table w-100">
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
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
export default Users