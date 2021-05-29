import Link from 'next/link'
import Head from 'next/head'
import {useState, useContext, useEffect} from 'react'
import {DataContext} from '../../store/GlobalState'
import {patchData} from '../../utils/fetchData'
import {useRouter} from 'next/router'

const changePassword = (props) => {
    const initialState = { password: '',confirmPassword: ''};
    const [userData,setUserData] = useState(initialState)
    const {password, confirmPassword } = userData

    const [state, dispatch] = useContext(DataContext)
    const router = useRouter()
   
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }
    const handleSubmit = async e =>{
        //ko load lai trang
        e.preventDefault()
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        if(!userData.password || !userData.confirmPassword){
            return dispatch({ type: 'NOTIFY', payload: {error: "Vui lòng nhập đủ thông tin để dổi mật khẩu."} })
        }
        if(userData.password.length < 6)return dispatch({ type: 'NOTIFY', payload: {error: "Mật khẩu mới phải ít nhất 6 kí tự."} })
        if(userData.password !== userData.confirmPassword){
            return dispatch({ type: 'NOTIFY', payload: {error: "Nhập lại mật khẩu mới không đúng."} })
        }
        patchData('user/forgotPassword/changePassword', {password: userData.password, token: props.token}, props.token)
        .then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
            dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
            return router.push('/signin');
        })       
        
    }

    return (
        <div className='signin'>
            <Head>
                <title>Đổi mật khẩu</title>
            </Head>
            <div className='body'>
            <div className="container">
                <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center"><b>ĐỔI MẬT KHẨU</b></h5>
                        <form className="form-signin" onSubmit={handleSubmit}>
                        <div className="form-label-group">
                            <input type="password" id="inputPassword" name="password" value={password} onChange={handleChangeInput} className="form-control" placeholder="Mật khẩu mới" autoFocus/>
                            <label htmlFor="inputPassword">Mật khẩu mới</label>
                        </div>

                        <div className="form-label-group">
                            <input type="password" id="inputConfirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChangeInput} className="form-control" placeholder="Nhập lại mật khẩu mới"/>
                            <label htmlFor="inputConfirmPassword">Nhập lại mật khẩu mới</label>
                        </div>

                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Đổi mật khẩu</button>
                        <br/>
                        <center><Link href="/forgotPassword"><a style={{color: 'crimson'}}>Quên mật khẩu?</a></Link></center>
                        <hr className="my-4"/>
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
export default changePassword
export async function getServerSideProps({params: {token}}) {
    return {
        props: {
            token: token
        }
    }
}