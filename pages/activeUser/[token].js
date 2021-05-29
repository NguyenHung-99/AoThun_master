import Link from 'next/link'
import Head from 'next/head'
import {useContext} from 'react'
import {DataContext} from '../../store/GlobalState'
import {patchData} from '../../utils/fetchData'
import {useRouter} from 'next/router'

const activeUser = (props) => {
    

    const [state, dispatch] = useContext(DataContext)
    const router = useRouter()
   
    const handleSubmit = async e =>{
        //ko load lai trang
        e.preventDefault()
    
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        patchData('user/activeUser', {token: props.token}, props.token)
        .then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
            dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
            return router.push('/signin')
            
        })       
        
    }
    const handleResendCode = async e => {

    }

    return (
        <div className='signin'>
            <Head>
                <title>Active Tài khoản</title>
            </Head>
            <div className='body'>
            <div className="container">
                <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center">Active Tài khoản</h5>
                        <form className="form-signin" onSubmit={handleSubmit}>
                        <center><span>Vui lòng nhấn <b>ACTIVE</b> để active tài khoản của bạn.</span></center>
                        <br/>
                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Active</button>
                        <br/>
                        <center><Link href="/"><a style={{color: 'crimson'}}>Quay lại trang chủ</a></Link></center>
                        <hr className="my-4"/>
                        <p>Gửi lại Active Link? <Link href="#"><a style={{color: 'crimson'}} onClick={handleResendCode}>Gửi lại Link</a></Link></p>                  
                        
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
export default activeUser
export async function getServerSideProps({params: {token}}) {
    return {
        props: {
            token: token
        }
    }
}