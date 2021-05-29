import Head from "next/head"
import { useContext } from "react"
import { DataContext } from "../store/GlobalState"

const orderManager = () => {
    const [state, dispatch] = useContext(DataContext)
    const { auth , orders} = state

    if(!auth.user) return null

    return (
        <div className="wrapper wrapper--w750">
            <div className="card card-4">
                <div className="card-body">

                    <div className="col-sm-12">

                        <div className="products_manager" style={{marginLeft:'5%', marginRight:'5%'}}>

                            <Head>
                                <title> Quản lý đơn hàng</title>
                            </Head>

                            <h2 style={{textAlign:'center'}} className="text-uppercase">Đơn hàng</h2>
                            {
                            orders.length === 0 && auth.user.role === 'user'
                            && <div className="card-body cart">
                                <div className="col-sm-12 empty-cart-cls text-center">
                                    <h3><strong>BẠN CHƯA CÓ ĐƠN HÀNG NÀO</strong></h3>
                                    <br />
                                    <a href="/collection" className="btn btn-primary cart-btn-transform m-3"
                                        data-abc="true">Tiếp tục mua
                                        sắm</a>
                                </div>
                            </div>
                            }
                            {
                            orders.length === 0 && auth.user.role === 'admin'
                            && <div className="card-body cart">
                                <div className="col-sm-12 empty-cart-cls text-center">
                                    <h3><strong>CHƯA CÓ ĐƠN ĐẶT HÀNG NÀO</strong></h3>
                                    <br />
                                    
                                </div>
                            </div>
                            }
                            <div className="my-3 table-responsive">
                                <table className="table-bordered table-hover w-100 text-uppercase"
                                    style={{minWidth: '600px', cursor: 'pointer'}}>
                                    <thead className="bg-light font-weight-bold">
                                        <tr>
                                            <td className="p-2">Mã đơn hàng</td>
                                            <td className="p-2">Ngày đặt hàng</td>
                                            <td className="p-2">Tổng tiền</td>
                                            <td className="p-2">Giao hàng</td>
                                            <td className="p-2">Thanh toán</td>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                        orders.map(order => (
                                        <tr key={order._id}>
                                            <td className="p-2">
                                                <a href={`/order/${order._id}`}> {order._id}
                                                </a>

                                            </td>
                                            <td className="p-2">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-2">{order.total} ₫</td>
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
                    </div>
                </div>
            </div>
        </div>

    )
}
export default orderManager