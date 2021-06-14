import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Tabs, Radio, message } from 'antd';
import { Table } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { getData } from '../utils/fetchData';
import { DataContext } from '../store/GlobalState';
import Link from 'next/link'
import Head from 'next/head';

const DoanhThuChart = () => {

    const [state, dispatch] = useContext(DataContext)
   
    const [optionValueTime, setOptionValueTime] = useState(0);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Doanh thu',
                data: [],
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderWidth: 4
            }
        ]
    });

    const [countDonHangShow, setCountDonHangShow] = useState(8);
    const [donHangShowEnd, setDonHangShowEnd] = useState(false);
    const [dataChiTietDonHang, setDataChiTietDonHang] = useState([]);


    function hamChuyenDoiNgay(date) {
        var strDate = '';
        var now = new Date();
        var ngay = date.getDate().toString();
        var thang = (date.getMonth() + 1).toString();
        var nam = date.getFullYear().toString();

        strDate = ngay + '/' + thang + '/' + nam;
        return strDate;
    }

    function format_curency(a) {
        a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        return a;
    }
    //get Doannh thu => chart
    //get doanh thu đơn đã hoàn thành theo tuần
    async function LayDataDoanhThuTuanNay() {
        
        const res = await getData('thongke/DoanhThu/TheoTuan')
        if (res.status === 'success') {
            var chartDataa = {
                labels: res.dataDate,
                datasets: [
                    {
                        label: 'Doanh Thu',
                        data: res.dataDoanhThu,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                        borderWidth: 4
                    }
                    
                ]
            }
            setChartData(chartDataa);
            setDataChiTietDonHang(res.data);
        } else {
            dispatch({ type: 'NOTIFY', payload: {error: res.err} })
            message.error();
        }

       
    }
     //get doanh thu đơn đã hoàn thành theo 3 tháng gần nhất
    async function LayDataDoanhThu3ThangGanNhat() {
        
        const res = await getData('thongke/DoanhThu/3Thang')
        console.log(res.dataDate)
        if (res.status === 'success') {
            var chartDataa = {
                labels: res.dataDate,
                datasets: [
                    {
                        label: 'Doanh Thu',
                        data: res.dataDoanhThu,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                        borderWidth: 4
                    }
                    
                ]
            }
            setChartData(chartDataa);
            setDataChiTietDonHang(res.data);
        } else {
            dispatch({ type: 'NOTIFY', payload: {error: res.err} })
         
        }

       
    }
    async function LayDataDoanhThu6ThangGanNhat() {
        
        const res = await getData('thongke/DoanhThu/6Thang')
        console.log(res.dataDate)
        if (res.status === 'success') {
            var chartDataa = {
                labels: res.dataDate,
                datasets: [
                    {
                        label: 'Doanh Thu',
                        data: res.dataDoanhThu,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                        borderWidth: 4
                    }
                    
                ]
            }
            setChartData(chartDataa);
            setDataChiTietDonHang(res.data);
        } else {
            dispatch({ type: 'NOTIFY', payload: {error: res.err} })
           
        }

       
    }
     //get doanh thu đơn đã hoàn thành theo tháng
    async function LayDataDoanhThuThangNay() {
        
        const res = await getData('thongke/DoanhThu/TheoThang')
       
        if (res.status === 'success') {
            var chartDataa = {
                labels: res.dataDate,
                datasets: [
                    {
                        label: 'Doanh Thu',
                        data: res.dataDoanhThu,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                        borderWidth: 4
                    }
                    
                ]
            }
            setChartData(chartDataa);
            setDataChiTietDonHang(res.data);
        } else {
            dispatch({ type: 'NOTIFY', payload: {error: res.err} })
            message.error();
        }

       
    }

    useEffect(() => {
        LayDataDoanhThuTuanNay()
    }, []);
   

    useEffect(() => {
        if (optionValueTime === 0) {
            LayDataDoanhThuTuanNay();
        }

        if (optionValueTime === 1) {
            LayDataDoanhThuThangNay();
        }

        if (optionValueTime === 2) {
            LayDataDoanhThu3ThangGanNhat();
        }

        if (optionValueTime === 3) {
            LayDataDoanhThu6ThangGanNhat();
        }
    }, [optionValueTime])
    
    useEffect(() => {
        if (countDonHangShow >= dataChiTietDonHang.length && dataChiTietDonHang.length !== 0) {
            setDonHangShowEnd(true);
        }
    }, [countDonHangShow])
    return (
        <Fragment>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 20 }}>
            <Head>
                <title>Doanh Thu</title>
            </Head>
            <h2>Doanh Thu</h2>
            <hr/>
            <div className='col'>
                <span>(*Kết quả báo cáo đều được dựa vào các đơn hàng đã hoàn thành)</span>
                <br></br>
                <Radio.Group value={optionValueTime} onChange={(e) => {
                    setOptionValueTime(e.target.value);
                }}>
                    <Radio.Button value={0} style={{paddingRight:20}}>Tuần này</Radio.Button>
                    <Radio.Button value={1} style={{paddingRight:20}}>Tháng này</Radio.Button>
                    <Radio.Button value={2} style={{paddingRight:20}}>3 tháng gần nhất</Radio.Button>
                    <Radio.Button value={3} style={{paddingRight:20}}>6 tháng gần nhất</Radio.Button>
                </Radio.Group>

                <br></br><br></br>
                <br></br><br></br>
                <div style={{ height: 600, width: 1200, marginLeft: 100 }}>
                    <Line data={chartData} options={{
                        responsive: true,
                        title: {
                            text: 'BIỂU ĐỒ MIỀN', display: true
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 10,
                                        beginAtZero: true
                                    },
                                    gridLines: {
                                        display: false,

                                    }
                                }
                            ],
                            xAxes: [
                                {
                                    gridLines: {
                                        display: false
                                    }
                                }
                            ]
                        }
                    }}></Line>
                </div>

                <br></br><br></br>
                <br></br><br></br>
                <div style={{ height: 600, width: 1200, marginLeft: 100 }}>
                            <Bar data={chartData} options={{
                                responsive: true,
                                title: {
                                    text: 'BIỂU ĐỒ CỘT', display: true
                                },
                                scales: {
                                    yAxes: [
                                        {
                                            ticks: {
                                                autoSkip: true,
                                                maxTicksLimit: 10,
                                                beginAtZero: true
                                            },
                                            gridLines: {
                                                display: false,

                                            }
                                        }
                                    ],
                                    xAxes: [
                                        {
                                            gridLines: {
                                                display: false
                                            }
                                        }
                                    ]
                                }
                            }}></Bar>
                        </div>
                        <br></br><br></br>
                        <br></br><br></br>
                <div style={{ height: 300, width: 600, marginLeft: 100 }}>
                    <Pie data={chartData} options={{
                        responsive: true,
                        title: {
                            text: 'BIỂU ĐỒ TRÒN', display: true
                        }
                    }}></Pie>
                </div>

                <div style={{ width: '100%', marginTop: 300 }}>
                    <h4 >CHI TIẾT DOANH THU</h4>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID đơn hàng</th>
                                
                                <th>Khách Hàng</th>
                                <th>Doanh thu</th>
                                <th>Ngày tạo</th>
                                <th>Ngày hoàn thành</th>
                            </tr>
                        </thead>
                        <tbody>
                            {

                                dataChiTietDonHang.map((item, i) => {
                                    if (i < countDonHangShow) {
                                        return <tr key={i}>
                                            <td><Link href={`/order/${item._id}`}>
                                                    {item._id}
                                                </Link>
                                            </td>
                                            
                                            <td style={{ width: 400 }}>{item.user.ten}</td>
                                            <td>{format_curency((item.total).toString())}</td>
                                            <td>{hamChuyenDoiNgay(new Date(item.createdAt))}</td>
                                            <td>{hamChuyenDoiNgay(new Date(item.dateOfPayment))}</td>
                                        </tr>
                                    }
                                })

                            }
                        </tbody>
                    </Table>
                    {
                        donHangShowEnd === false && (
                            <center>                               
                                <a onClick={(e) => {
                                    e.preventDefault();
                                    setCountDonHangShow(prev => prev + 8);
                                }}>Xem thêm</a>
                            </center>
                        )
                    }
                </div>

            </div>
        </div>
    </Fragment >
    )
}
export default DoanhThuChart