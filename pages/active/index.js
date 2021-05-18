import Link from 'next/link'
import Head from 'next/head'
import {useContext} from 'react'
import {DataContext} from '../../store/GlobalState'
import {patchData} from '../../utils/fetchData'
import {useRouter} from 'next/router'

const active = () => {
    

    const [state, dispatch] = useContext(DataContext)
    const router = useRouter()
   
    const handleSubmit = async e =>{
        //ko load lai trang
        e.preventDefault()
    
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        patchData('user/sendLinkActive', {email: router.query.email})
        .then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
            dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
            return router.push('/signin')
            
        })       
        
    }
   

    return (
        <div className='signin'>
            <Head>
                <title>Active</title>
            </Head>
            <div className='body'>
            <div className="container">
                <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                    <div className="card-body">
                       
                        <form className="form-signin" onSubmit={handleSubmit}>
                        <center><span>Vui lòng nhấn <b>SEND CODE</b> để gửi mail active tài khoản của bạn.</span></center>
                        <br/>
                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">SEND CODE</button>
                        <br/>
                        <center><Link href="/"><a style={{color: 'crimson'}}>Go Home</a></Link></center>
                        
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
export default active
