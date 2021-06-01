import Link from 'next/link'
import Head from 'next/head'
import {useState, useContext, useEffect} from 'react'
import {DataContext} from '../store/GlobalState'
import {postData} from '../utils/fetchData'
import Cookie from 'js-cookie'
import {useRouter} from 'next/router'

const Signin = () => {

    const initialState = { email: '',password: ''};
    const [userData,setUserData] = useState(initialState)
    const {email, password } = userData

    const [state, dispatch] = useContext(DataContext)
    const {auth} = state
    const [typePass, setTypePass] = useState(false)

    const router = useRouter()
    
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
   const validInputData = (email, password) => {
    if(!email)
    return 'Email không được để trống!.'
    if(!password)
    return 'Password không được để trống!.'
    if(!validateEmail(email))
    return 'Địa chỉ Email không hợp lệ!.'
    if(password.length < 6)
    return 'Mật khẩu có ít nhất 6 kí tự!.'

   }
    const handleSubmit = async e =>{
        //ko load lai trang
        e.preventDefault()
        const errMsg = validInputData(email,password)
        if(errMsg) return dispatch({ type: 'NOTIFY', payload: {error: errMsg} })
        dispatch({ type: 'NOTIFY', payload: {loading: true} })

        const res = await postData('auth/login', userData)
        
        if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        if(res.notActive === true) 
        {
            dispatch({ type: 'NOTIFY', payload: [] })
                return router.push({
                pathname:'active',
                query: {email: res.email}
            })
        }

        dispatch({ type: 'NOTIFY', payload: {success: res.msg} });
        dispatch({ type: 'AUTH', payload: {
            toke: res.access_token,
            user:  res.user
        } });
        
        //lưu token vào cookie
        Cookie.set('refreshtoken', res.refresh_token,{
            path:'api/auth/accessToken',
            expires: 7
        })
        localStorage.setItem('firstLogin', true)
    }

    useEffect(() => {
        //login success redirect home
        if(Object.keys(auth).length !== 0) router.push('/')
        if(Object.keys(auth).length !== 0 && auth.user.role === 'admin') router.push('/adminDashBoard')
       
    }, [auth])

    return (
        <div className='signin'>
            <Head>
                <title>Đăng nhập</title>
            </Head>
            <div className='body'>
            <div className="container">
                <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center">Đăng nhập</h5>
                        <form className="form-signin" onSubmit={handleSubmit}>
                        <div className="form-label-group">
                            <input type="email" id="inputEmail" name="email" value={email} onChange={handleChangeInput} className="form-control" placeholder="Email address" autoFocus/>
                            <label htmlFor="inputEmail">Email</label>
                        </div>

                        <div className="form-label-group auth_page ">
                            <input type={typePass ? 'text' : 'password'} id="inputPassword" name="password" value={password} onChange={handleChangeInput} className="form-control" placeholder="Password"/>
                            <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>
                            <label htmlFor="inputPassword">Mật khẩu</label>
                        </div>

                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Đăng nhập</button>
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
export default Signin