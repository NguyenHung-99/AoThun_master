import Head from 'next/head'
import { useContext, useState, useEffect } from 'react'
import {DataContext} from '../../store/GlobalState'
import {useRouter} from 'next/router'
import {patchData} from '../../utils/fetchData'


const EditUser = () => {
    const [state, dispatch] = useContext(DataContext)
    const {auth, users} = state

    const router = useRouter()
    const {id} = router.query

    const [editUser, setEditUser] = useState([])
    const [checkAdmin, setCheckAdmin] = useState(false)
    const [num, setNum] = useState(0)

    //get User by ID, check role use
    useEffect(() => {
        users.forEach(user =>{
            if(user._id === id){
                setEditUser(user)
                setCheckAdmin(user.account.phanQuyen === 'admin'? true : false)
                
            }
        })
    }, [users]);

    const handleSubmit = () => {
        let role = checkAdmin ? 'admin' : 'user'
        if(num % 2 !== 0){
            dispatch({type: 'NOTIFY', payload: {loading: true}})
            patchData(`user/userManager/${editUser._id}`, {role}, auth.token)
            .then(res => {

                if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
               
                dispatch({type: 'ADD_USERS', payload: [] })
                return dispatch({type: 'NOTIFY', payload: {success: res.msg}})

            })
        }
        
    }
    const handleCheck = () => {
        setCheckAdmin(!checkAdmin)
        setNum(num + 1)
    }
    if(!auth.user) return null
    return (
        <div className="edit_user my-3" style={{marginLeft:'10%', marginRight:'10%', marginTop:'20px'}}>
            <Head>
                <title>Edit User</title>
            </Head>

            <div>
                <button className="btn btn-dark" onClick={() => router.back()}>
                    <i className="fas fa-long-arrow-alt-left" aria-hidden></i> Go Back
                </button>
            </div>
           
            <div className="col-md-4 mx-auto my-4">
                <h2 className="text-uppercase text-secondary" style={{textAlign:'center'}}><b>Edit User</b></h2>
                <hr/>
                <div className="form-label-group">
                    <input type="text"  id="name" defaultValue={editUser.ten} disabled  className="form-control" placeholder="Name"/>
                    <label htmlFor="inputEmail">Name</label>
                </div>

                <div className="form-label-group">
                    <input type="text" id="email" defaultValue={editUser.email} disabled className="form-control" placeholder="Password"/>
                    <label htmlFor="inputPassword">Email</label>
                </div>

                <div className="form-label-group">
                    <input type="checkbox" id="isAdmin" checked={checkAdmin}
                    style={{width: '20px', height: '20px'}} onChange={handleCheck} />

                    <label htmlFor="isAdmin" style={{transform: 'translate(4px, -3px)'}}>
                        isAdmin
                    </label>
                </div>

                <button className="btn btn-dark" onClick={handleSubmit}>Update</button>

            </div>

        </div>
    )
}
export default EditUser