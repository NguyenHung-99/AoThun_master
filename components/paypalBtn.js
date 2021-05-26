import {useEffect, useRef, useContext} from 'react'
import {patchData, postData} from '../utils/fetchData'
import {DataContext} from '../store/GlobalState'
import { updateItem } from '../store/Actions'
import { useRouter } from 'next/router'


const paypalBtn = ({name, email, sdt, diachi, phuongxa, quanhuyen, tinhtp, total, cart}) => {
    const refPaypalBtn = useRef()
    const [state, dispatch] = useContext(DataContext)
    const {auth, orders} = state
    const router = useRouter()
    

    useEffect(() => {
        paypal.Buttons({
            createOrder: function(data, actions) {
              // This function sets up the details of the transaction, including the amount and line item details.
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: parseInt(total/23000)
                  }
                }]
              });
            },
            onApprove: function(data, actions) {
              dispatch({ type: 'NOTIFY', payload: {loading: true} })
              // This function captures the funds from the transaction.
              return actions.order.capture().then(function(details) {
                console.log(details)
                //path data to api
                postData('order/payment', {name, email, sdt, diachi, phuongxa, quanhuyen, tinhtp, total, cart, paymentId: details.payer.payer_id}, auth.token)
                  .then(res => {
                    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
                    //Thành công => xóa cart
                    dispatch({ type: 'ADD_CART', payload: [] })
                    const newOrders = {
                        ...res.newOrders,
                        user: auth.user
                    }
                    dispatch({type: 'ADD_ORDERS', payload: [...orders, newOrders] })
                    dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                    return router.push(`/order/${res.newOrders._id}`)
                  })
                
              });
            }
          }).render(refPaypalBtn.current);
    }, [])

    return (
        <div ref={refPaypalBtn}>

        </div>
    )

}
export default paypalBtn