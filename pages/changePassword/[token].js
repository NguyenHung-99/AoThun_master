import Link from 'next/link'
import Head from 'next/head'
import {useState, useContext, useEffect} from 'react'
import {DataContext} from '../../store/GlobalState'
import {patchData} from '../../utils/fetchData'

const changePassword = (props) => {
    const initialState = { password: '',confirmPassword: ''};
    const [userData,setUserData] = useState(initialState)
    const {password, confirmPassword } = userData

    const [state, dispatch] = useContext(DataContext)
    




    const handleChangeInput = e =>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }
    const handleSubmit = async e =>{
        //ko load lai trang
        e.preventDefault()
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        if(!userData.password || !userData.confirmPassword){
            return dispatch({ type: 'NOTIFY', payload: {error: "Please enter Password & Confirm Password"} })
        }
        if(userData.password.length < 6)return dispatch({ type: 'NOTIFY', payload: {error: "Password must be at least 6 characters."} })
        if(userData.password !== userData.confirmPassword){
            return dispatch({ type: 'NOTIFY', payload: {error: "Confirm Password Incorrect"} })
        }
        patchData('user/forgotPassword/changePassword', {password: userData.password, token: props.token}, props.token)
        .then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
            return dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        })       
        
    }

    return (
        <div className='signin'>
            <Head>
                <title>Change Password</title>
            </Head>
            <div className='body'>
            <div className="container">
                <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center">Change Password</h5>
                        <form className="form-signin" onSubmit={handleSubmit}>
                        <div className="form-label-group">
                            <input type="password" id="inputPassword" name="password" value={password} onChange={handleChangeInput} className="form-control" placeholder="New Password" autoFocus/>
                            <label htmlFor="inputEmail">New Password</label>
                        </div>

                        <div className="form-label-group">
                            <input type="password" id="inputConfirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChangeInput} className="form-control" placeholder="Confirm New Password"/>
                            <label htmlFor="inputPassword">Confirm New Password</label>
                        </div>

                        <div className="custom-control custom-checkbox mb-3">
                            <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                            <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
                        </div>
                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Change Password</button>
                        <br/>
                        <center><Link href="/forgotPassword"><a style={{color: 'crimson'}}>Forgot your password?</a></Link></center>
                        <hr className="my-4"/>
                        <p>You don't have an account? <Link href="/register"><a style={{color: 'crimson'}}>Register Now</a></Link></p>                  
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