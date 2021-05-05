import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import {DataContext} from '../../store/GlobalState'
import {useRouter} from 'next/router'
import moment from 'moment';
import {Bar } from 'react-chartjs-2'
import { daysInMonth } from '../../store/Actions';

const DetailOrder = () => {

    const [state, dispatch] = useContext(DataContext)
    const {orders, auth} = state
    const router = useRouter()
  
    const [orderList, setOrderList] = useState([])
   
    useEffect(() => {
        const newArr = orders.filter(order => Number(moment(order.createdAt).format('MM')) ===  Number(router.query.month))
        
        setOrderList(newArr)
        
    }, [orders]);
    //get day in month

    var soNgayTrongThang = daysInMonth(router.query.month, router.query.year);
    var firstDateOfMonth = new Date(router.query.year, router.query.month - 1, 1);
    
    var arrDate = [];
    var arrResult = [];
    for (let index = 1; index <= soNgayTrongThang; index++) {
        var dateThem = new Date(firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(), index);
         var dateResult = moment(dateThem).format('DD-MM-yyyy')
        arrDate.push(dateThem);
        arrResult.push(dateResult)
    }

//    get data order in day of month 
    var arrDoanhThu = [];
    for (let i = 0; i < arrDate.length; i++) {
        var doanhThu = 0;
        for (let index = 0; index < orderList.length; index++) {
           
            if (Number(arrDate[i].getDate()) === Number(moment(orderList[index].createdAt).format('DD')) &&
            Number(arrDate[i].getMonth() + 1) === Number(moment(orderList[index].createdAt).format('MM')) &&
            Number(arrDate[i].getFullYear()) === Number(moment(orderList[index].createdAt).format('yyyy'))) {
                console.log('vo được đat r')
                doanhThu += orderList[index].total;
                
            }
        }
        arrDoanhThu.push(doanhThu);
        
    }
  
    if(!auth.user) return null
    return (
        <div className="my-3">
        <Head>
            <title>Detail Orders Month</title>
        </Head>

        <Bar
                        data={{
                            labels: arrResult,
                            datasets:[
                                {
                                    label: 'Sales',
                                    data:arrDoanhThu,
                                    backgroundColor: 'rgba(255,99,133,0.6)',
                                    labels:{
                                        color:'rgb(255,99,132)'   
                                    },
                                    position:'right'
                                
                                }
                            ],
                            
                        }}
                        
                    />
        {orderList.map(oder => <p>{oder.createdAt} + {oder.total}</p>)}
        
       
        
     

    </div>
    )
}
export default DetailOrder