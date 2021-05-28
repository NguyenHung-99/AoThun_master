import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import Link from 'next/link'
import valid, { validatePhone } from '../utils/valid'
import { getData, patchData } from '../utils/fetchData'
import {ImageUpload} from '../utils/ImageUpload'
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getUser = async (email) => {
    const res = await getData(`user/${email}`)
    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
    return res.users
}

const Profile = () => {
    const initialState = {avata: '', name: '', sdt: '', ngayTao: Date.now(), ngaySinh: Date.now(), gioiTinh: true, 
    role: 'user',trangThai: true, password: '', cf_password: '', diachi: '', quanhuyen: '', phuongxa: '', tinhtp: ''};
    const [data, setData] = useState(initialState)
    const {avata, name, sdt, gioiTinh, role, ngayTao, ngaySinh, trangThai, password, cf_password, diachi, phuongxa, quanhuyen, tinhtp} = data


    const [state, dispatch] = useContext(DataContext)
    const { auth , notify, orders} = state

    const [dataUser, setDataUser] = useState({})
    const [account, setAccount] = useState({})
    const [address, setAddress] = useState({})

    const [dob, setdob] = useState("")
      
    useEffect(() => {
        if(auth.user){
            const getDataUser = async() => {
                const res = await getUser(auth.user.email)
                const users = res.users
                const accounts = res.account
                const addresss = res.address
                setAccount(accounts)
                setDataUser(users)
                setAddress(addresss)
                setData({...data, name: users.ten, sdt: users.sdt, gioiTinh: users.gioiTinh, ngaySinh: users.ngaySinh, 
                    ngayTao: users.ngayTao, role: accounts.phanQuyen, trangThai: accounts.trangThai, diachi: addresss.diaChi,
                phuongxa: addresss.phuongXa, quanhuyen: addresss.quanHuyen, tinhtp: addresss.tinhThanhPho})  
           }
           getDataUser()
           
        }
     }, [auth.user]);
     
    
     const handleChangeInput = (e) => {
        const {name, value} = e.target
        setData({...data, [name]: value})
        dispatch({type: 'NOTIFY', payload: {} })

     }

     const handleChangeDateInput = (date) => {
        setData({...data, ngaySinh:date})
        dispatch({ type: 'NOTIFY', payload: {} })
     }

     const handleUpdateProfile = async e => {
        e.preventDefault()
        if(!validatePhone(sdt)){
            return dispatch({ type: 'NOTIFY', payload: {error: 'Số điện thoại không đúng định dạng!.'} })
        }
        if(name === '' || sdt === ''){
            return dispatch({ type: 'NOTIFY', payload: {error: 'Vui lòng nhập đủ thông tin.'} })
        }
        const res = await getUser(auth.user.email)
        const users = res.users
       
        if(name!== users.ten || sdt !== users.sdt || gioiTinh !== users.gioiTinh || ngaySinh !== users.ngaySinh || avata){
            return updateInfor()
        } 
        else {return dispatch({ type: 'NOTIFY', payload: {error: 'Vui lòng nhập thông tin muốn thay đổi!.'} })} 
       
     }
     const handleUpdateAddress = async e => {
        e.preventDefault()
        const res = await getUser(auth.user.email)
        const Address = res.address
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        if(diachi === "" || phuongxa === '' || tinhtp === '' || quanhuyen=== '')
        {
            return dispatch({ type: 'NOTIFY', payload: {error: 'Vui lòng nhập đầy đủ thông tin!.'} })
        }
        if(diachi !== Address.diaChi || phuongxa !== Address.phuongXa || tinhtp !== Address.tinhThanhPho || quanhuyen !== Address.quanHuyen){
            patchData('user/updateAddress', {diachi, phuongxa, quanhuyen, tinhtp}, auth.token)
            .then(res => {
                if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
                return dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
            })
        }else {
            return dispatch({ type: 'NOTIFY', payload: {error: 'Vui lòng nhập thông tin muốn thay đổi!.'} })
        } 
     
     }
     const handleChangePassword = e => {
         e.preventDefault()
         if(password.length < 6){
            return dispatch({ type: 'NOTIFY', payload: {error: 'Mật khẩu có ít nhất 6 kí tự!.'} })
         }
         if(password !== cf_password){
            return dispatch({ type: 'NOTIFY', payload: {error: 'Mật khẩu không khớp vui lòng nhập lại!'} })  
         }
         updatePassword()
     }
            
            
     const updatePassword = () => {
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        patchData('user/resetPassword', {password}, auth.token)
        .then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
            return dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        })
     }
     const changeAvatar = (e) => {
         const file = e.target.files[0]
         if(!file) return dispatch({ type: 'NOTIFY', payload: {error: 'Không có ảnh được chọn.'} })
         if(file.size > 1024 * 1024) return dispatch({ type: 'NOTIFY', payload: {error: 'File lớn hơn 1mb.'} })
         if(file.type !== "image/jpeg" && file.type !== "image/png") 
            return dispatch({ type: 'NOTIFY', payload: {error: 'File không đúng định dạng.'} })
         setData({...data, avata: file})
     }
    const updateInfor = async() => {
         let media
         dispatch({type:'NOTIFY', payload: {loading:true}})
         if(avata) media = await ImageUpload([avata])
         patchData('user', {name, avata: avata? media[0].url : auth.user.avata, sdt:sdt, gioiTinh: gioiTinh, ngaySinh: ngaySinh}, auth.token).then(res => {
             if(!res) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
             dispatch({
                 type: 'AUTH',
                 payload: {
                     token: auth.token,
                     user: res.user
                 }
             })
             return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
         })
     }
    if(!auth.user) return null
    
     
    return( 
        <div className="profile_page" style={{marginLeft:'10%', marginRight:'10%', marginTop: '30px'}}>
            <Head>
                <title>Profile</title>
            </Head>

            <section className="row text-secondary my-3">
                <div className="col-md-4">
                    <h3 className="text-center text-uppercase">
                        {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}
                    </h3>

                    <div className="avatar">
                        <img src={avata ? URL.createObjectURL(avata) : auth.user.avata} 
                        alt="avata"/>
                        <span>
                            <i className="fas fa-camera"></i>
                            <p>Change</p>
                            <input type="file" name="file" id="file_up" onChange={changeAvatar}
                            accept="image/*" />
                        </span>
                    </div>
                    
                    <h2 style={{textAlign:'center'}}>{name}</h2>
                  
                </div>

                <div className="col-md-8">              
                    <nav>
                        <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Orders</a>
                            <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</a>
                            <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Address</a>
                            <a className="nav-item nav-link" id="nav-about-tab" data-toggle="tab" href="#nav-about" role="tab" aria-controls="nav-about" aria-selected="false">Password</a>
                        </div>
                    </nav>
                    <div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        <h2 style={{textAlign:'center'}} className="text-uppercase">Orders</h2>
                        <div className="my-3 table-responsive">
                        <table className="table-bordered table-hover w-100 text-uppercase"
                        style={{minWidth: '600px', cursor: 'pointer'}}>
                            <thead className="bg-light font-weight-bold">
                                <tr>
                                    <td className="p-2">id</td>
                                    <td className="p-2">date</td>
                                    <td className="p-2">total</td>
                                    <td className="p-2">delivered</td>
                                    <td className="p-2">paid</td>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    orders.map(order => (
                                        <tr key={order._id}>
                                            <td className="p-2">
                                                <Link href={`/order/${order._id}`}>
                                                    <a>{order._id}</a>
                                                </Link>
                                                
                                            </td>
                                            <td className="p-2">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-2">${order.total}</td>
                                            <td className="p-2">
                                                {
                                                    order.delivered === 'Đã giao hàng'
                                                    ? <i className="fas fa-check text-success"></i>
                                                    : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                            <td className="p-2">
                                                {
                                                    order.paid
                                                    ? <i className="fas fa-check text-success"></i>
                                                    : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                        </tr> 
                                    ))
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div style={{marginLeft:'20%', marginRight:'20%'}}>
                                <h2 style={{textAlign:'center'}}>PROFILE</h2>
                                <br/>
                                    <div className='row'>
                                        <div className='col'>
                                            <div className="form-label-group">
                                                <input type="text" id="inputUsername" name="name" value={name}  onChange={handleChangeInput} className="form-control" placeholder="Username" />
                                                <label htmlFor="inputUserame">Username</label>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-label-group">
                                                <input type="tel" id="phone" name="sdt" value={sdt} onChange={handleChangeInput} className="form-control" placeholder="Phone" />
                                                <label htmlFor="inputPhone">Phone</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-label-group">
                                        <input type="email" id="inputEmail" name="email" readOnly defaultValue={auth.user.email} onChange={handleChangeInput} className="form-control" placeholder="Email address" />
                                        <label htmlFor="inputEmail">Email address</label>
                                    </div>
                                    <hr/>
                                    <div className="row row-space">
                                        <div className="col">
                                            <label htmlFor="inputBirthday" className="label">BirthDay</label>

                                            <div className="input-group">
                                                <div className="input-group-icon" >
                                                    <DatePicker style={{width:'21rem'}} value={moment(ngaySinh).format('DD-MM-YYYY')} className="input--style-4 js-datepicker form-control" name='ngaySinh'  id="birthday" 
                                                        selected={dob} 
                                                        onChange={date => {
                                                            handleChangeDateInput(date)
                                                        }}
                                                        maxDate={new Date()} 
                                                        showYearDropdown
                                                        scrollableMonthYearDropdown>
                                                    </DatePicker>
                                                </div>
                                            </div>
                                        </div>
                                  
                                        <div className="col"> 
                                            <label className="label">Gender</label>
                                            <div className="p-t-10">
                                                <label className="radio-container m-r-45">Male
                                                    <input  type="radio" defaultChecked={gioiTinh? 'checked' : ''} name="gioiTinh" value="true" onClick={handleChangeInput}/>
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="radio-container">Female
                                                    <input  type="radio" defaultChecked={gioiTinh? 'checked' : ''} name="gioiTinh" value="false" onClick={handleChangeInput}/>
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>   
                                    </div>
                                    <hr style={{backgroundColor:'gray'}}></hr>
                                <br/>
                                <div className="form-label-group">
                                    <input id="inputDateCreateUser" value={moment(ngayTao).format('DD-MM-YYYY')} readOnly name="password"  onChange={handleChangeInput} className="form-control" placeholder="Day Create User" />
                                    <label htmlFor="inputDateCreateUser">Day create user</label>
                                </div>
                                
                             
                                <div className="form-label-group">
                                        <input type="text" id="inputRole" name="role" value={role} readOnly={auth.user.role === 'user'? 'readOnly': ''} onChange={handleChangeInput} className="form-control" placeholder="Role" />
                                        <label htmlFor="inputRole">Role</label>
                                    </div>
                                    
                                    <div className="form-label-group">
                                        <input type="text" id="inpuStatus" value={trangThai? 'Activated' : 'Un Activated'} readOnly={auth.user.role === 'user'? 'readOnly': ''} name="status" onChange={handleChangeInput} className="form-control" placeholder="Status" />
                                        <label htmlFor="inpuStatus">Status</label>
                                    </div>
                                                              
                            <button style={{marginLeft:'40%'}} className="btn btn-info" disabled={notify.loading} onClick={handleUpdateProfile}>
                                Update
                            </button>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                            <div style={{marginRight:'20%',marginLeft:'20%'}}>
                                    <h2 style={{textAlign:'center'}}>UPDATE ADDRESS</h2>
                                    <br/>
                                    <div className="form-label-group">
                                        <input type="text" id="inputDiaChi" name="diachi" value={diachi} onChange={handleChangeInput} className="form-control" placeholder="Địa chỉ" />
                                        <label htmlFor="inputDiaChi">Địa chỉ</label>
                                    </div>
                                            
                                    <div className="form-label-group">
                                        <input type="text" id="inputPhuongXa" value={phuongxa} name="phuongxa" onChange={handleChangeInput} className="form-control" placeholder="Phường / Xã" />
                                        <label htmlFor="inputPhuongXa">Phường / Xã</label>
                                    </div>    
                                    <hr/> 
                                    <div className="form-label-group">
                                        <input type="text" id="inputQuanHuyen" name="quanhuyen" value={quanhuyen} onChange={handleChangeInput} className="form-control" placeholder="Quận / Huyện" />
                                        <label htmlFor="inputQuanHuyen">Quận / Huyện</label>
                                    </div>
                                            
                                    <div className="form-label-group">
                                        <input type="text" id="inputTinhTP" value={tinhtp} name="tinhtp" onChange={handleChangeInput} className="form-control" placeholder="Tỉnh / Thành Phố" />
                                        <label htmlFor="inputTinhTP">Tỉnh / Thành Phố</label>
                                    </div>         
                                        
                                    <button style={{marginLeft:'35%'}} className="btn btn-info" disabled={notify.loading} onClick={handleUpdateAddress}>
                                        Update Address
                                    </button>
                                </div>
                        </div>
                        <div className="tab-pane fade" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                            <div style={{marginRight:'20%',marginLeft:'20%'}}>
                            <h2 style={{textAlign:'center'}}>CHANGE PASSWORD</h2>
                            <br/>
                                <div className="form-label-group">
                                            <input type="password" id="inputPassword" name="password" value={password} onChange={handleChangeInput} className="form-control" placeholder="Password" />
                                            <label htmlFor="inputPassword">New Password</label>
                                        </div>
                                        
                                        <div className="form-label-group">
                                            <input type="password" id="inputConfirmPassword" value={cf_password} name="cf_password" onChange={handleChangeInput} className="form-control" placeholder="Password" />
                                            <label htmlFor="inputConfirmPassword">Confirm new password</label>
                                        </div>
                                    
                                <button style={{marginLeft:'35%'}} className="btn btn-info" disabled={notify.loading} onClick={handleChangePassword}>
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Profile