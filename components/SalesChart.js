import React from 'react'
import { useContext , useEffect} from 'react'
import { DataContext } from '../store/GlobalState'
import moment from 'moment';

import {Bar } from 'react-chartjs-2'
import {useRouter} from 'next/router'
const SalesChart = () =>{
    const [state] = useContext(DataContext)
    const { orders} = state
	const router = useRouter()
    
    
    const reportLabels = moment.months();
    const total = [0,0,0,0,0,0,0,0,0,0,0,0]
    
    orders.map(order =>{
     
        switch (moment(order.createdAt).format('MM')) {
            case '01':
                total[0] =  total[0] + order.total
                break;
            case '02':
                total[1] =  total[1] + order.total
                break;
            case '03':
                total[2] =  total[2] + order.total
                break;
             case '04':
                total[3] =  total[3] + order.total
                break;   
            case '05':
                total[4] =  total[4] + order.total
                break;
            case '06':
                total[5] =  total[5] + order.total
                break;     
            case '07':
                total[6] =  total[6] + order.total
                break; 
            case '08':
                total[7] =  total[7] + order.total
                break;
            case '09':
                total[8] =  total[8] + order.total
                break;    
            case '10':
                total[9] =  total[9] + order.total
                break;   
             case '11':
                total[10] =  total[10] + order.total
                break;   
            case '12':
                total[11] =  total[11] + order.total
                break;                           
            default:
                break;
        }
    })
    return (
                    <Bar
                        data={{
                            labels: reportLabels,
                            datasets:[
                                {
                                    label: 'Sales',
                                    data:total,
                                    backgroundColor: 'rgba(255,99,133,0.6)',
                                    labels:{
                                        color:'rgb(255,99,132)'   
                                    },
                                    position:'right'
                                
                                }
                            ]
                        }}
                        options={{
                            onClick: (event,elements) =>{
                                if(elements.length > 0)
                                {
                                   
                                    const xLabel = elements[0].index;
                                    return router.push({
                                        pathname:'DetailOrderMonth',
                                        query: {year: 2021, month: xLabel +1}
                                    })
                                    
                                }
                            }
                        }}
                    />
    )
}

export default SalesChart