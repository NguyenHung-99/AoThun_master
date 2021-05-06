import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import {DataContext} from '../../store/GlobalState'
import {useRouter} from 'next/router'
import moment from 'moment';
import {Bar } from 'react-chartjs-2'
import { getData } from '../../utils/fetchData';


const DetailOrder = () => {

    const [state, dispatch] = useContext(DataContext)
    const {orders, auth} = state
    const router = useRouter()
  
    const [orderList, setOrderList] = useState([])
    const [arrLabel, setArrLabel] = useState([])
    const [arrData, setArrData] = useState([])
   
    //get day in month
    useEffect(async() => {
        const month = router.query.month
        const year = router.query.year
        const res = await getData(`thongke/${month}/${year}`);
        setArrLabel(res.arrResult)
        setArrData(res.arrDoanhThu)
    }, [router]);
    
  
    if(!auth.user) return null
    return (
        <div className="my-3">
        <Head>
            <title>Detail Orders Month</title>
        </Head>

        <Bar
                        data={{
                            labels: arrLabel,
                            datasets:[
                                {
                                    label: 'Sales',
                                    data: arrData,
                                    backgroundColor: 'rgba(255,99,133,0.6)',
                                    labels:{
                                        color:'rgb(255,99,132)'   
                                    },
                                    position:'right'
                                
                                }
                            ],
                            
                        }}
                        
                    />
    </div>
    )
}
export default DetailOrder