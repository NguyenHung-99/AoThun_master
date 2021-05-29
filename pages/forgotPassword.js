import Link from 'next/link'
import Head from 'next/head'
import {useState, useContext, useEffect} from 'react'
import {DataContext} from '../store/GlobalState'
import {postData } from '../utils/fetchData';

const forgotPassword = () => {
    const initialState = { email: ''};

    const [userData,setUserData] = useState(initialState)
    const {email } = userData

    const [state, dispatch] = useContext(DataContext)
    const {auth} = state

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }
    const handleSubmit = async e =>{
        //ko load lai trang
        e.preventDefault()
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        
        const res = await postData('user/forgotPassword', {email: userData.email})
        if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        return dispatch({ type: 'NOTIFY', payload: {success: res.message} });
        
    }
    //có tk không vào được trang
    if(auth.user) return null
    return (
        <div className='signin'>
        <Head>
            <title>Quên mật khẩu</title>
        </Head>
        <div className='body'>
        <div className="container">
            <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card card-signin my-5">
                <div className="card-body">
                    <h5 className="card-title text-center"><b>QUÊN MẬT KHẨU</b></h5>
                    
                    <form className="form-signin" onSubmit={handleSubmit}>
                    
                    <div className="form-label-group">
                        <input type="email" id="inputEmail" name="email" value={email} onChange={handleChangeInput} className="form-control" placeholder="Email address" autoFocus/>
                        <label htmlFor="inputEmail">Email address</label>
                    </div>

                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Gửi Email</button>
                    <hr className="my-4"/>
                    <p>Bạn đã có tài khoản? <Link href="/signin"><a style={{color: '#6969ec'}}>Đăng nhập</a></Link></p> 
                    <p>Bạn chưa có tài khoản? <Link href="/register"><a style={{color: 'crimson'}}>Đăng ký ngay</a></Link></p>                  
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}
export default forgotPassword