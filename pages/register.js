import {useState, useContext, useEffect} from 'react'
import valid from '../utils/valid'
import {DataContext} from '../store/GlobalState'
import {postData} from '../utils/fetchData'
import {useRouter} from 'next/router'
import Link from 'next/link'
import DatePicker from "react-datepicker";
import Head from 'next/head'
import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
    const initialState = {name: '', sdt: '',ngaySinh: '', email: '', gioiTinh: true, password: '', cf_password: ''};
    const [userData,setUserData] = useState(initialState)
    const {name , sdt, email,ngaySinh, gioiTinh, password, cf_password } = userData
    const [state, dispatch] = useContext(DataContext)
    const {auth} = state
    const router = useRouter()
    const [dob, setdob] = useState("")
    function handleChangeDateInput(date) {
        setdob(date)
        setUserData({...userData, ngaySinh:date})
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
        dispatch({ type: 'NOTIFY', payload: {} })
    }
  
    const handleSubmit = async e =>{
        //ko load lai trang
        e.preventDefault()
        const errMsg = valid(name , sdt, email, ngaySinh, gioiTinh, password, cf_password)
        if(errMsg){
            return dispatch({ type: 'NOTIFY', payload: {error: errMsg} })
        }
     
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        const res = await postData('auth/register', userData)
        
        if(res.err) {
           
            return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        }
        
        dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        router.push('/signin')

    }

    useEffect(() => {
        //Login success không register được
        if(Object.keys(auth).length !== 0) router.push('/')
       
    }, [auth])

   
    return (
        <div className="page-wrapper font-poppins" style={{backgroundColor:'whitesmoke'}}>
            <Head>
                <title>Đăng ký</title>
            </Head>
                <div className="wrapper wrapper--w680">
                    <div className="card card-4">
                        <div className="card-body">
                            <center>
                                <h2 className="title">ĐĂNG KÝ</h2>
                            </center>
                            
                            <form  onSubmit={handleSubmit}>
                                <div className="row row-space">
                                    <div className="col">
                                        <div className="input-group">
                                            <label className="label">Tên</label>
                                            <input  className="input--style-4"  type="text" id="inputUserame" name="name" value={name} onChange={handleChangeInput}  placeholder="Tên"  autoFocus/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group">
                                            <label className="label">Số điện thoại</label>
                                            <input className="input--style-4" type="tel" id="phone" name="sdt" value={sdt} 
                                            onChange={handleChangeInput} 
                                            placeholder="Số điện thoại"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row row-space">
                                    <div className="col">
                                        <div className="input-group">
                                            <label className="label">Sinh nhật</label>
                                            <div className="input-group-icon">
                                                <DatePicker className="input--style-4 js-datepicker" name='ngaySinh'  
                                                selected={dob} 
                                                onChange={date => {
                                                    handleChangeDateInput(date)
                                                }}
                                                maxDate={new Date()} 
                                                showYearDropdown
                                                scrollableMonthYearDropdown
                                                placeholderText="Ngày sinh nhật"
                                                 ></DatePicker>
                                            </div>  
                                           
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group">
                                            <label className="label">Giới tính</label>
                                            <div className="p-t-10">
                                                <label className="radio-container m-r-45">Nam giới
                                                    <input  type="radio" defaultChecked="defaultChecked" name="gioiTinh" value="true" onChange={handleChangeInput}/>
                                                    <span className="checkmark"></span>
                                                </label>
                                               
                                                <label className="radio-container">Nữ giới
                                                    <input  type="radio" name="gioiTinh" value="false" onChange={handleChangeInput}/>
                                                    <span className="checkmark"></span>
                                                </label>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row row-space">
                                    <div className="col">
                                        <div className="input-group">
                                            <label className="label">Email</label>
                                            <input className="input--style-4"   type="email" id="inputEmail" name="email" value={email} onChange={handleChangeInput} placeholder="Email address"/>
                                        </div>
                                    </div>
                                   
                                </div>
                               
                                    <div className="row row-space">
                                        <div className="col">
                                            <div className="input-group">
                                                <label className="label">Mật khẩu</label>
                                                <input className="input--style-4" type="password" id="inputPassword" name="password" value={password} onChange={handleChangeInput}  placeholder="Mật khẩu"/>
                                            </div>
                                        </div>
                                        <div className="col">
                                        <div className="input-group">
                                            <label className="label">Nhập lại mật khẩu</label>
                                            <input className="input--style-4" type="password" id="inputConfirmPassword" name="cf_password" value={cf_password} onChange={handleChangeInput}  placeholder="Nhập lại mật khẩu"/>
                                        </div>
                                    </div>
                                </div>
                                
                           
                                <div className="p-t-15">
                                <center>
                                    <button className ="button__register" type="submit">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        Đăng ký
                                    </button>
                                </center>
                                <hr className="my-4"/>
                                <p>Bạn đã có tài khoản? <Link href="/signin"><a style={{color: 'crimson'}}>Đăng nhập ngay</a></Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    )
}
export default Register